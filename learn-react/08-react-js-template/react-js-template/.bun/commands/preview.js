import { serve } from 'bun'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * 빌드 결과물 미리보기
 * @param {Object} config 설정 객체
 */
export async function preview(config) {
  const { root, outDir } = config
  const { port = 4173, host = 'localhost' } = config.preview || {}
  
  const DIST_DIR = join(root, outDir)
  
  if (!existsSync(DIST_DIR)) {
    console.error(`❌ 빌드 폴더(${DIST_DIR})가 존재하지 않습니다. 먼저 'bun run build'를 실행하세요.`)
    process.exit(1)
  }
  
  serve({
    port,
    hostname: host,
    async fetch(req) {
      const url = new URL(req.url)
      let pathname = url.pathname
      
      // 루트 경로는 index.html로 처리
      if (pathname === '/') {
        pathname = '/index.html'
      }
      
      // 경로에 파일 확장자가 없으면 .html 추가 시도 (SPA 라우팅 지원)
      if (!pathname.includes('.')) {
        const htmlPath = join(DIST_DIR, `${pathname}.html`)
        if (existsSync(htmlPath)) {
          pathname = `${pathname}.html`
        } else {
          // SPA 라우팅을 위해 index.html 반환
          pathname = '/index.html'
        }
      }
      
      const filePath = join(DIST_DIR, pathname)
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
      
      return new Response('Not Found', { status: 404 })
    },
  })
  
  const SERVER_URL = `http://${host}:${port}`
  
  console.log(`\n🔍 미리보기 서버 실행 중...\n`)
  console.log(`  🌐 ${SERVER_URL}\n`)
  console.log(`  📁 ${DIST_DIR}\n`)
  console.log(`  종료하려면 Ctrl+C를 누르세요.\n`)
}