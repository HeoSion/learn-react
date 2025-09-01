import { serve, version } from 'bun'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

// 경로 상수
const ROOT_DIR = join(import.meta.dir, '..') // 상위 디렉토리(프로젝트 루트)로 설정
const DIST_DIR = join(ROOT_DIR, 'dist')
const INDEX_HTML = join(DIST_DIR, 'index.html')

// 빌드 폴더 존재 확인
if (!existsSync(DIST_DIR)) {
  console.error(
    '\x1b[31m\x1b[1m오류:\x1b[0m dist 폴더가 존재하지 않습니다. 먼저 `bun run build` 명령을 실행하세요.',
  )
  process.exit(1)
}

// 포트 설정 (환경 변수 또는 기본값)
const PORT = process.env.PORT || 5000

// 서버 시작
serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)
    let pathname = url.pathname

    // 기본 경로 처리
    if (pathname === '/') {
      pathname = '/index.html'
    }

    // 보안: 경로 순회 방지
    if (pathname.includes('..')) {
      return new Response('Forbidden', { status: 403 })
    }

    // 정적 파일 제공
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
        woff: 'font/woff',
        woff2: 'font/woff2',
        ttf: 'font/ttf',
        otf: 'font/otf',
        webp: 'image/webp',
      }

      const contentType = mimeTypes[ext] || 'application/octet-stream'

      return new Response(await file.arrayBuffer(), {
        headers: { 'Content-Type': contentType },
      })
    }

    // SPA 지원: HTML5 History API를 위한 폴백
    // 확장자가 없는 경로는 index.html로 리다이렉트
    if (!pathname.includes('.')) {
      const indexFile = Bun.file(INDEX_HTML)
      if (await indexFile.exists()) {
        return new Response(await indexFile.text(), {
          headers: { 'Content-Type': 'text/html' },
        })
      }
    }

    return new Response('Not Found', { status: 404 })
  },
})

// 서버 정보 출력
;(() => {
  const BUN_VERSION = version
  const SERVER_URL = `http://localhost:${PORT}`

  // ANSI 색상 코드
  const greenBg = '\x1b[42m'
  const green = '\x1b[32m'
  const bold = '\x1b[1m'
  const white = '\x1b[37m'
  const gray = '\x1b[90m'
  const reset = '\x1b[0m'

  // 콘솔 출력 스타일링
  const previewBox = `${greenBg}${bold}${white} PREVIEW ${reset}`
  const bunVer = `${bold}${green}Bun v${BUN_VERSION}${reset}`
  const readyText = `${bold}${white}빌드 결과물 제공 중${reset}`
  const arrow = `${green}${bold}➜${reset}`
  const urlText = `${green}${bold}${SERVER_URL}${reset}`
  const helpText = `${gray}단축키를 보려면 ${green}h${reset}${gray} + ${green}Enter${reset}${gray}를 누르세요.${reset}`

  console.log(`\n${previewBox}  ${bunVer}  ${readyText}\n`)
  console.log(`  ${arrow} ${urlText}\n`)
  console.log(helpText)

  // 단축키 처리
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
      // 브라우저 열기
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
      console.log('프리뷰 서버를 종료합니다.')
      process.exit(0)
    }
  })
})()
