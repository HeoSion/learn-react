#!/usr/bin/env bun
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { resolveConfig } from './config.js'
import { initCache } from './optimizer.js'

// 명령행 인수 파싱
const args = process.argv.slice(2)
const command = args[0] || 'dev'

async function main() {
  try {
    // 캐시 초기화
    initCache()

    // 설정 로드
    const config = await resolveConfig()

    // 명령 실행
    switch (command) {
      case 'dev':
      case 'serve':
        await import('./dev.js')
        break
        
      case 'build':
        // 출력 디렉토리 생성
        const outDir = join(config.root, config.build.outDir)
        if (!existsSync(outDir)) {
          await mkdir(outDir, { recursive: true })
        }
        
        await import('./build.js')
        break
        
      case 'preview':
        await import('./preview.js')
        break
        
      default:
        console.error(`알 수 없는 명령: ${command}`)
        process.exit(1)
    }
  } catch (error) {
    console.error(`오류 발생: ${error.message}`)
    console.error(error.stack)
    process.exit(1)
  }
}

main()