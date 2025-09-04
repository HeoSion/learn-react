import { join } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import { writeFile, readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

// 캐시 디렉토리
const CACHE_DIR = join(process.cwd(), 'node_modules', '.cache', 'bun-build')

// 캐시 초기화
export function initCache() {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true })
  }
}

// 파일 해시 생성
export function hashContent(content) {
  return createHash('md5').update(content).digest('hex').substring(0, 8)
}

// 캐시 키 생성
export function createCacheKey(filePath, content, dependencies = []) {
  const hash = createHash('md5')
  hash.update(filePath)
  hash.update(content)
  
  for (const dep of dependencies) {
    hash.update(dep)
  }
  
  return hash.digest('hex')
}

// 캐시 저장
export async function saveToCache(key, data) {
  const cachePath = join(CACHE_DIR, key)
  await writeFile(cachePath, JSON.stringify(data))
}

// 캐시 로드
export async function loadFromCache(key) {
  const cachePath = join(CACHE_DIR, key)
  
  if (!existsSync(cachePath)) {
    return null
  }
  
  try {
    const data = await readFile(cachePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.warn(`캐시 로드 실패: ${error.message}`)
    return null
  }
}

// 코드 분할 설정 생성
export function createCodeSplittingConfig(config) {
  return {
    ...config,
    splitting: true,
    outdir: config.outdir,
    format: 'esm',
    naming: {
      ...config.naming,
      chunk: 'chunks/[name].[hash].js'
    }
  }
}

// 트리 쉐이킹 설정 생성
export function createTreeShakingConfig(config) {
  return {
    ...config,
    minify: {
      ...config.minify,
      treeshake: true
    }
  }
}

// 에셋 최적화 설정
export function createAssetOptimizationConfig(config) {
  return {
    ...config,
    loader: {
      ...config.loader,
      '.png': 'file',
      '.jpg': 'file',
      '.jpeg': 'file',
      '.gif': 'file',
      '.svg': 'file',
      '.webp': 'file',
      '.woff': 'file',
      '.woff2': 'file',
      '.ttf': 'file',
      '.otf': 'file'
    },
    naming: {
      ...config.naming,
      asset: 'assets/[name].[hash].[ext]'
    }
  }
}

// 빌드 최적화 설정 생성
export function createOptimizedBuildConfig(config) {
  return createAssetOptimizationConfig(
    createTreeShakingConfig(
      createCodeSplittingConfig(config)
    )
  )
}