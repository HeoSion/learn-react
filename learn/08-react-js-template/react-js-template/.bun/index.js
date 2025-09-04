#!/usr/bin/env bun

import { loadConfig } from './common/config.js'
import { createCssPlugin } from './common/css-plugin.js'

// 명령행 인수 파싱
const args = process.argv.slice(2)
const command = args[0] || 'dev'

// 설정 로드
const config = await loadConfig()

// 명령어에 따라 다른 모듈 실행
switch (command) {
  case 'dev':
  case 'serve':
    const { startDevServer } = await import('./commands/dev.js')
    await startDevServer(config)
    break
    
  case 'build':
    const { build } = await import('./commands/build.js')
    await build(config)
    break
    
  case 'preview':
    const { preview } = await import('./commands/preview.js')
    await preview(config)
    break
    
  default:
    console.error(`알 수 없는 명령어: ${command}`)
    console.log('사용 가능한 명령어: dev, build, preview')
    process.exit(1)
}