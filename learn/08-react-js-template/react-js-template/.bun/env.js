import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// 환경 변수 파싱 함수 (dotenv 간소화 버전)
function parseDotenv(content) {
  const result = {}
  const lines = content.toString().split('\n')
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    // 주석이나 빈 줄 무시
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue
    }
    
    // KEY=VALUE 형식 파싱
    const match = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/.exec(trimmedLine)
    if (match) {
      const key = match[1]
      let value = match[2] || ''
      
      // 따옴표 제거
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1)
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1)
      }
      
      result[key] = value
    }
  }
  
  return result
}

// 환경 변수 확장 함수 (dotenv-expand 간소화 버전)
function expandDotenv(parsed, env = process.env) {
  const result = { ...parsed }
  
  // 변수 참조 확장 (예: ${VAR} 또는 $VAR)
  for (const [key, value] of Object.entries(result)) {
    result[key] = value.replace(/\${([^}]+)}/g, (_, varName) => {
      return result[varName] || env[varName] || ''
    }).replace(/\$([a-zA-Z0-9_]+)/g, (_, varName) => {
      return result[varName] || env[varName] || ''
    })
  }
  
  return result
}

// 환경 변수 로드 함수
export function loadEnv(mode, root = process.cwd()) {
  const envFiles = [
    `.env`,
    `.env.local`,
    `.env.${mode}`,
    `.env.${mode}.local`
  ]
  
  const env = { ...process.env }
  
  // 환경 변수 파일 로드
  for (const file of envFiles) {
    const path = join(root, file)
    if (existsSync(path)) {
      const content = readFileSync(path, 'utf-8')
      const parsed = parseDotenv(content)
      const expanded = expandDotenv(parsed, env)
      
      // 환경 변수 추가
      for (const [key, value] of Object.entries(expanded)) {
        env[key] = value
      }
    }
  }
  
  // 클라이언트에 노출할 환경 변수 필터링
  const clientEnv = {}
  for (const [key, value] of Object.entries(env)) {
    if (key.startsWith('BUN_') || key.startsWith('PUBLIC_')) {
      clientEnv[key] = value
    }
  }
  
  return {
    env,
    clientEnv,
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      ...Object.fromEntries(
        Object.entries(clientEnv).map(([key, value]) => [
          `process.env.${key}`,
          JSON.stringify(value)
        ])
      )
    }
  }
}

// 모드 결정 함수
export function resolveMode() {
  return process.env.NODE_ENV || 'development'
}

// 환경 변수 주입 함수
export function injectEnvToHtml(html, env) {
  const script = `<script>
    window.process = window.process || {};
    window.process.env = ${JSON.stringify(env)};
  </script>`
  
  return html.replace('</head>', `${script}</head>`)
}