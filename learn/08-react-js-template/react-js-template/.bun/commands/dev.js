import { serve } from 'bun'
import { existsSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { createCssPlugin } from '../common/css-plugin.js'
import { processCssImports, hashPath, transformCssModule } from '../common/css-processor.js'

// 임시 디렉토리 설정 (JSX 트랜스파일용)
const TEMP_DIR = join(tmpdir(), 'bun-dev-server-cache')

if (!existsSync(TEMP_DIR)) {
  mkdirSync(TEMP_DIR, { recursive: true })
}

/**
 * 개발 서버 시작
 * @param {Object} config 설정 객체
 */
export async function startDevServer(config) {
  const { root, srcDir, publicDir } = config
  const { port, host } = config.server
  
  const ROOT_DIR = root
  const SRC_DIR = join(ROOT_DIR, srcDir)
  const PUBLIC_DIR = join(ROOT_DIR, publicDir)
  const INDEX_HTML = join(ROOT_DIR, 'index.html')
  
  // JSX 파일 캐시 객체
  const jsxCache = new Map()
  // CSS 파일 캐시 객체
  const cssCache = new Map()
  // CSS 처리 중 상태 추적 (순환 참조 방지)
  const cssProcessing = new Set()
  
  // Bun 서버 시작
  serve({
    port,
    hostname: host,
    async fetch(req) {
      const url = new URL(req.url)
      const pathname = url.pathname

      // '/' 경로는 루트 index.html 반환
      if (pathname === '/') {
        const file = Bun.file(INDEX_HTML)

        if (await file.exists()) {
          return new Response(await file.text(), {
            headers: { 'Content-Type': 'text/html' },
          })
        }

        return new Response('index.html not found', { status: 404 })
      }

      // 보안: 경로 순회 방지
      if (pathname.includes('..')) {
        return new Response('Not allowed', { status: 403 })
      }

      // src 폴더의 파일 처리
      if (pathname.startsWith('/src/')) {
        const filePath = join(ROOT_DIR, pathname)
        const file = Bun.file(filePath)

        if (await file.exists()) {
          // Content-Type 설정
          const ext = pathname.split('.').pop()
          const mimeTypes = {
            html: 'text/html',
            js: 'application/javascript',
            jsx: 'application/javascript',
            css: 'text/css',
            png: 'image/png',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            svg: 'image/svg+xml',
            ico: 'image/x-icon',
            json: 'application/json',
            txt: 'text/plain',
          }

          const contentType = mimeTypes[ext] || 'application/octet-stream'

          // JSX 파일은 Bun.build를 사용하여 변환
          if (ext === 'jsx') {
            return await processJsx(filePath, pathname)
          }

          // CSS 파일 처리 - 일반 CSS와 CSS 모듈 모두 지원
          if (ext === 'css') {
            return await processCss(filePath, pathname)
          }

          return new Response(await file.arrayBuffer(), {
            headers: { 'Content-Type': contentType },
          })
        }
      }

      // 정적 파일은 public 폴더에서 찾음
      const filePath = join(PUBLIC_DIR, pathname)
      const file = Bun.file(filePath)

      if (await file.exists()) {
        // Content-Type 설정
        const ext = pathname.split('.').pop()
        const mimeTypes = {
          html: 'text/html',
          js: 'application/javascript',
          css: 'text/css',
          png: 'image/png',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          svg: 'image/svg+xml',
          ico: 'image/x-icon',
          json: 'application/json',
          txt: 'text/plain',
        }

        const contentType = mimeTypes[ext] || 'application/octet-stream'

        return new Response(await file.arrayBuffer(), {
          headers: { 'Content-Type': contentType },
        })
      }

      // 루트 디렉토리의 파일 처리
      const rootFilePath = join(ROOT_DIR, pathname)
      const rootFile = Bun.file(rootFilePath)

      if (await rootFile.exists()) {
        const ext = pathname.split('.').pop()
        const mimeTypes = {
          html: 'text/html',
          js: 'application/javascript',
          css: 'text/css',
          png: 'image/png',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          svg: 'image/svg+xml',
          ico: 'image/x-icon',
          json: 'application/json',
          txt: 'text/plain',
        }

        const contentType = mimeTypes[ext] || 'application/octet-stream'

        return new Response(await rootFile.arrayBuffer(), {
          headers: { 'Content-Type': contentType },
        })
      }

      return new Response('Not Found', { status: 404 })
    },
  })
  
  // CSS 파일 처리 함수
  async function processCss(filePath, pathname) {
    try {
      // 파일 내용 및 수정 시간 확인
      const file = Bun.file(filePath)
      const stat = await file.stat()
      const lastModified = stat.mtime.getTime()

      // 캐시 확인
      const cacheKey = `${pathname}:${lastModified}`
      if (cssCache.has(cacheKey)) {
        return new Response(cssCache.get(cacheKey), {
          headers: { 'Content-Type': 'text/css' },
        })
      }

      // CSS 파일 내용 읽기
      let cssContent = await file.text()

      // @import 구문 처리
      cssProcessing.clear() // 처리 상태 초기화
      cssProcessing.add(filePath) // 현재 파일 처리 중 표시
      cssContent = await processCssImports(cssContent, dirname(filePath))
      cssProcessing.delete(filePath) // 처리 완료 표시

      // CSS 모듈 처리 (파일명이 .module.css로 끝나는 경우)
      if (pathname.endsWith('.module.css')) {
        // CSS 모듈 변환 - 클래스 이름에 고유 해시 추가
        const hash = hashPath(pathname)
        const moduleContent = transformCssModule(cssContent, hash)

        // 캐시에 저장
        cssCache.set(cacheKey, moduleContent)

        return new Response(moduleContent, {
          headers: { 'Content-Type': 'text/css' },
        })
      }

      // 일반 CSS 파일 처리
      cssCache.set(cacheKey, cssContent)

      return new Response(cssContent, {
        headers: { 'Content-Type': 'text/css' },
      })
    } catch (error) {
      console.error(`CSS 처리 오류: ${pathname}`, error)
      return new Response(`/* CSS 처리 중 오류 발생: ${error.message} */`, {
        headers: { 'Content-Type': 'text/css' },
        status: 500,
      })
    }
  }
  
  // JSX 파일 처리 함수
  async function processJsx(filePath, pathname) {
    try {
      // 파일 내용 및 수정 시간 확인
      const file = Bun.file(filePath)
      const stat = await file.stat()
      const lastModified = stat.mtime.getTime()

      // 캐시 확인
      const cacheKey = `${pathname}:${lastModified}`
      if (jsxCache.has(cacheKey)) {
        return new Response(jsxCache.get(cacheKey), {
          headers: { 'Content-Type': 'application/javascript' },
        })
      }

      // 파일 경로에서 고유한 해시 생성
      const hash = hashPath(pathname)
      // 고유한 출력 파일 이름 생성
      const outputFileName = `${hash}_${Date.now()}.js`

      // 임시 출력 디렉토리 - 각 빌드마다 고유한 디렉토리 사용
      const uniqueBuildDir = join(TEMP_DIR, hash)

      // 디렉토리가 없으면 생성
      if (!existsSync(uniqueBuildDir)) {
        mkdirSync(uniqueBuildDir, { recursive: true })
      }

      // Bun.build를 사용하여 JSX 트랜스파일
      const result = await Bun.build({
        entrypoints: [filePath],
        outdir: uniqueBuildDir,
        target: 'browser',
        minify: false,
        sourcemap: 'inline',
        plugins: [createCssPlugin({ minify: false })],
      })

      if (!result.success) {
        console.error(`JSX 트랜스파일 실패: ${pathname}`, result.logs)
        return new Response(
          `// 오류: JSX 트랜스파일 실패\n${result.logs.join('\n')}`,
          {
            headers: { 'Content-Type': 'application/javascript' },
            status: 500,
          },
        )
      }

      // 출력 파일 경로 (Bun.build는 원본 파일 구조를 유지)
      // 원본 파일 이름에서 확장자만 .js로 변경
      const outputPath = join(
        uniqueBuildDir,
        pathname.split('/').pop().replace('.jsx', '.js'),
      )

      // 트랜스파일된 코드 읽기
      const transpiledFile = Bun.file(outputPath)

      if (!(await transpiledFile.exists())) {
        console.error(`트랜스파일된 파일을 찾을 수 없음: ${outputPath}`)
        return new Response(`// 오류: 트랜스파일된 파일을 찾을 수 없음`, {
          headers: { 'Content-Type': 'application/javascript' },
          status: 500,
        })
      }

      const transpiledCode = await transpiledFile.text()

      // 캐시에 저장
      jsxCache.set(cacheKey, transpiledCode)

      return new Response(transpiledCode, {
        headers: { 'Content-Type': 'application/javascript' },
      })
    } catch (error) {
      console.error(`JSX 처리 오류: ${pathname}`, error)
      return new Response(`// 오류: JSX 처리 중 문제 발생\n// ${error.message}`, {
        headers: { 'Content-Type': 'application/javascript' },
        status: 500,
      })
    }
  }
  
  // 개발 정보 출력
  const BUN_VERSION = Bun.version
  const SERVER_URL = `http://${host}:${port}`

  // ANSI 색상 코드 정의
  const cyanBg = '\x1b[46m'
  const cyan = '\x1b[36m'
  const bold = '\x1b[1m'
  const white = '\x1b[37m'
  const gray = '\x1b[90m'
  const reset = '\x1b[0m'

  // DEV 박스 스타일
  const devBox = `${cyanBg}${bold}${white} DEV ${reset}`
  const bunVer = `${bold}${cyan}Bun v${BUN_VERSION}${reset}`
  const readyText = `${bold}${white}${Math.random().toFixed(2)} ms${reset}`

  // URL 강조
  const arrow = `${cyan}${bold}➜${reset}`
  const urlText = `${cyan}${bold}${SERVER_URL}${reset}`

  // 하단 안내문(회색)
  const helpText = `${gray}단축키를 보려면 ${cyan}h${reset}${gray} + ${cyan}Enter${reset}${gray}를 누르세요.${reset}`

  console.log(`\n${devBox}  ${bunVer}  ${readyText}\n`)
  console.log(`  ${arrow} ${urlText}\n`)
  console.log(helpText)

  // 키보드 입력 처리
  process.stdin.setEncoding('utf-8')
  process.stdin.on('data', async (data) => {
    const key = data.trim()
    if (key === 'h') {
      console.log(`
단축키 안내:
  h + Enter   도움말 보기
  o + Enter   브라우저에서 열기
  q + Enter   서버 종료
    `)
    }
    if (key === 'o') {
      // cross-platform 브라우저 열기 (비동기 import)
      try {
        const { exec } = await import('child_process')
        const startCmd =
          process.platform === 'win32'
            ? `start ${SERVER_URL}`
            : process.platform === 'darwin'
              ? `open ${SERVER_URL}`
              : `xdg-open ${SERVER_URL}`
        exec(startCmd)
        console.log('브라우저를 엽니다.')
      } catch (error) {
        console.error('브라우저 열기 실패:', error)
      }
    }
    if (key === 'q') {
      console.log('Bun 서버를 종료합니다.')
      process.exit(0)
    }
  })
}