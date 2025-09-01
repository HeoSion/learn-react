import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

// TypeScript 설정 로드
export async function loadTsConfig(root = process.cwd()) {
  const tsConfigPath = join(root, 'tsconfig.json')
  
  if (!existsSync(tsConfigPath)) {
    return null
  }
  
  try {
    const content = await readFile(tsConfigPath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.warn(`TypeScript 설정 로드 실패: ${error.message}`)
    return null
  }
}

// TypeScript 파일 처리
export async function processTypeScript(filePath, content, tsConfig) {
  // Bun은 이미 TypeScript를 기본 지원하므로 단순 패스스루
  // 필요시 추가 처리 로직 구현
  return content
}

// TypeScript 플러그인 생성
export function createTypeScriptPlugin(options = {}) {
  return {
    name: 'typescript-plugin',
    
    async buildStart(config) {
      this.tsConfig = await loadTsConfig(options.root)
    },
    
    async transform(code, id) {
      if (!id.endsWith('.ts') && !id.endsWith('.tsx')) {
        return null
      }
      
      return {
        code: await processTypeScript(id, code, this.tsConfig),
        map: null
      }
    }
  }
}