import { join } from 'node:path'
import { existsSync } from 'node:fs'

// 구성 파일 확장자
const CONFIG_EXTENSIONS = ['.js', '.mjs', '.ts', '.mts']

// 구성 파일 이름
const CONFIG_NAMES = ['bun.config', 'bunfig']

// 구성 파일 찾기
export async function findConfig(root = process.cwd()) {
  for (const name of CONFIG_NAMES) {
    for (const ext of CONFIG_EXTENSIONS) {
      const configPath = join(root, `${name}${ext}`)
      
      if (existsSync(configPath)) {
        return configPath
      }
    }
  }
  
  return null
}

// 구성 파일 로드
export async function loadConfig(root = process.cwd()) {
  const configPath = await findConfig(root)
  
  if (!configPath) {
    return {
      root,
      server: {},
      build: {},
      plugins: []
    }
  }
  
  try {
    const userConfig = await import(configPath)
    return {
      root,
      ...userConfig.default || userConfig,
      configPath
    }
  } catch (error) {
    console.error(`구성 파일 로드 실패: ${error.message}`)
    return {
      root,
      server: {},
      build: {},
      plugins: []
    }
  }
}

// 구성 병합
export function mergeConfig(defaults, userConfig) {
  const result = { ...defaults }
  
  for (const [key, value] of Object.entries(userConfig)) {
    if (value === null || value === undefined) {
      continue
    }
    
    if (Array.isArray(value)) {
      result[key] = [...(result[key] || []), ...value]
    } else if (typeof value === 'object') {
      result[key] = { ...(result[key] || {}), ...value }
    } else {
      result[key] = value
    }
  }
  
  return result
}