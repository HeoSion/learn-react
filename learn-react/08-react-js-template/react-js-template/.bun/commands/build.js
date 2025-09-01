import { existsSync } from 'node:fs'
import { copyFile, mkdir, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { createCssPlugin } from '../common/css-plugin.js'

/**
 * 빌드 실행
 * @param {Object} config 설정 객체
 */
export async function build(config) {
  const startTime = performance.now()
  
  const { root, srcDir, publicDir, outDir } = config
  const { minify, sourcemap, target } = config.build
  
  const ROOT_DIR = root
  const SRC_DIR = join(ROOT_DIR, srcDir)
  const PUBLIC_DIR = join(ROOT_DIR, publicDir)
  const DIST_DIR = join(ROOT_DIR, outDir)
  const INDEX_HTML = join(ROOT_DIR, 'index.html')
  
  console.log('\n🚀 빌드 프로세스 시작...\n')

  try {
    await setupDistDir()
    const mainJsFilename = await buildJs()
    await processHtml(mainJsFilename)
    await copyAssets()
    await copyRootAssets()
    await cleanupTempDir()

    const endTime = performance.now()
    const buildTime = ((endTime - startTime) / 1000).toFixed(2)

    console.log(`\n✨ 빌드 완료! (${buildTime}초)\n`)
    console.log(`📁 빌드 결과물: ${DIST_DIR}`)
    console.log(`🌐 미리보기: bun run preview\n`)
  } catch (error) {
    console.error('\n❌ 빌드 중 오류 발생:', error)
    process.exit(1)
  }
  
  // dist 폴더 생성 또는 초기화
  async function setupDistDir() {
    console.log('🧹 빌드 폴더 초기화 중...')

    if (!existsSync(DIST_DIR)) {
      await mkdir(DIST_DIR, { recursive: true })
    }
  }

  // HTML 파일 처리 및 복사
  async function processHtml(mainJsFilename) {
    console.log('📄 HTML 파일 처리 중...')

    // index.html 읽기
    const htmlContent = await Bun.file(INDEX_HTML).text()

    // 스크립트 태그 변경 (개발용 -> 빌드용)
    const processedHtml = htmlContent.replace(
      /<script type="module" src="\.\/src\/main\.jsx"><\/script>/,
      `<script type="module" src="./${mainJsFilename}"></script>`,
    )

    // 처리된 HTML 저장
    await Bun.write(join(DIST_DIR, 'index.html'), processedHtml)
  }

  // JS 빌드
  async function buildJs() {
    console.log('🔨 JavaScript 빌드 중...')

    // 임시 빌드 디렉토리 생성 (충돌 방지)
    const tempBuildDir = join(DIST_DIR, '_temp_build')
    await mkdir(tempBuildDir, { recursive: true })

    const result = await Bun.build({
      entrypoints: [join(SRC_DIR, 'main.jsx')],
      outdir: tempBuildDir,
      minify,
      target,
      sourcemap: sourcemap ? 'external' : 'none',
      naming: {
        entry: 'main.[hash].js',
        chunk: 'chunks/[name].[hash].js',
        asset: 'assets/[name].[hash].[ext]',
      },
      plugins: [createCssPlugin({ minify })],
    })

    if (!result.success) {
      console.error('❌ 빌드 실패:', result.logs)
      process.exit(1)
    }

    // 생성된 파일 찾기 (main.*.js)
    const files = await readdir(tempBuildDir)
    const mainJsFile = files.find(
      (file) => file.startsWith('main.') && file.endsWith('.js'),
    )

    if (!mainJsFile) {
      console.error('❌ 빌드된 main.js 파일을 찾을 수 없습니다.')
      process.exit(1)
    }

    // 해시가 포함된 파일명 그대로 복사
    await copyFile(join(tempBuildDir, mainJsFile), join(DIST_DIR, mainJsFile))

    // 소스맵 파일이 있으면 이동
    const sourceMapFile = files.find(
      (file) => file.startsWith('main.') && file.endsWith('.js.map'),
    )
    if (sourceMapFile) {
      await copyFile(
        join(tempBuildDir, sourceMapFile),
        join(DIST_DIR, sourceMapFile),
      )
    }

    // chunks 폴더가 있으면 복사
    const chunksDir = join(tempBuildDir, 'chunks')
    if (existsSync(chunksDir)) {
      const distChunksDir = join(DIST_DIR, 'chunks')
      await mkdir(distChunksDir, { recursive: true })

      const chunkFiles = await readdir(chunksDir)
      for (const file of chunkFiles) {
        await copyFile(join(chunksDir, file), join(distChunksDir, file))
      }
    }

    // assets 폴더가 있으면 복사
    const assetsDir = join(tempBuildDir, 'assets')
    if (existsSync(assetsDir)) {
      const distAssetsDir = join(DIST_DIR, 'assets')
      await mkdir(distAssetsDir, { recursive: true })

      const assetFiles = await readdir(assetsDir)
      for (const file of assetFiles) {
        await copyFile(join(assetsDir, file), join(distAssetsDir, file))
      }
    }

    console.log(`✅ JavaScript 빌드 완료 (${result.outputs.length} 파일 생성)`)
    
    // 해시가 포함된 메인 JS 파일명 반환
    return mainJsFile
  }

  // 정적 에셋 복사 (public 폴더의 모든 파일)
  async function copyAssets() {
    console.log('🖼️ 정적 에셋 복사 중...')

    if (!existsSync(PUBLIC_DIR)) {
      console.log('📂 public 폴더가 없습니다. 에셋 복사를 건너뜁니다.')
      return
    }

    await copyDir(PUBLIC_DIR, DIST_DIR)
  }

  // 재귀적으로 파일 복사하는 함수
  async function copyDir(src, dest) {
    await mkdir(dest, { recursive: true })
    const entries = await readdir(src, { withFileTypes: true })

    for (const entry of entries) {
      const srcPath = join(src, entry.name)
      const destPath = join(dest, entry.name)

      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath)
      } else {
        await copyFile(srcPath, destPath)
      }
    }
  }

  // 루트 정적 파일 복사 (favicon 등)
  async function copyRootAssets() {
    console.log('🔍 루트 정적 파일 확인 중...')

    const rootAssets = ['favicon.ico', 'robots.txt', 'react.svg']

    for (const asset of rootAssets) {
      const assetPath = join(ROOT_DIR, asset)
      if (existsSync(assetPath)) {
        await copyFile(assetPath, join(DIST_DIR, asset))
        console.log(`  - ${asset} 복사 완료`)
      }
    }
  }
  
  // 임시 빌드 디렉토리 정리
  async function cleanupTempDir() {
    console.log('🧹 임시 빌드 디렉토리 정리 중...')
    
    const tempBuildDir = join(DIST_DIR, '_temp_build')
    if (existsSync(tempBuildDir)) {
      await rm(tempBuildDir, { recursive: true, force: true })
      console.log('  - _temp_build 디렉토리 삭제 완료')
    }
  }
}