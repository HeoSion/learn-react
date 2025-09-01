import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// 기본 설정
const defaultConfig = {
  // 경로 설정
  root: process.cwd(),
  srcDir: 'src',
  publicDir: 'public',
  outDir: 'dist',
  
  // 서버 설정
  server: {
    port: 3000,
    host: 'localhost',
  },
  
  // 빌드 설정
  build: {
    minify: true,
    sourcemap: true,
    target: 'browser',
  },
  
  // 플러그인
  plugins: [],
}

/**
 * 설정 파일 로드
 * @param {string} root 루트 디렉토리
 * @returns {Promise<Object>} 설정 객체
 */
export async function loadConfig(root = process.cwd()) {
  const configPaths = [
    join(root, 'bun.config.js'),
    join(root, 'bun.config.mjs'),
    join(root, 'bun.config.json'),
  ]
  
  let userConfig = {}
  
  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      if (configPath.endsWith('.json')) {
        const configContent = await readFile(configPath, 'utf-8')
        userConfig = JSON.parse(configContent)
      } else {
        userConfig = await import(configPath)
        userConfig = userConfig.default || userConfig
      }
      break
    }
  }
  
  // 설정 병합
  return mergeConfig(defaultConfig, userConfig)
}

/**
 * 설정 병합
 * @param {Object} defaults 기본 설정
 * @param {Object} userConfig 사용자 설정
 * @returns {Object} 병합된 설정
 */
function mergeConfig(defaults, userConfig) {
  const result = { ...defaults }
  
  for (const [key, value] of Object.entries(userConfig)) {
    if (value === null || value === undefined) {
      continue
    }
    
    if (typeof value === 'object' && !Array.isArray(value) && typeof result[key] === 'object') {
      result[key] = mergeConfig(result[key], value)
    } else {
      result[key] = value
    }
  }
  
  return result
}