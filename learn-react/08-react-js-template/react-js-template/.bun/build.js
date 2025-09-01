#!/usr/bin/env bun

import { loadConfig } from './common/config.js'
import { build } from './commands/build.js'

// 메인 함수
async function main() {
  try {
    // 설정 로드
    const config = await loadConfig()
    
    // 빌드 실행
    await build(config)
  } catch (error) {
    console.error('빌드 실행 중 오류 발생:', error)
    process.exit(1)
  }
}

// 스크립트 실행
main().catch(err => {
  console.error('치명적인 오류:', err)
  process.exit(1)
})