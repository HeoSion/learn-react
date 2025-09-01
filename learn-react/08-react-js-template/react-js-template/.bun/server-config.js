import { createServer as createHttpsServer } from 'node:https'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// 서버 설정 로드
export function loadServerConfig(configPath) {
  let config = {
    port: 3000,
    host: 'localhost',
    cors: true,
    https: false,
    proxy: {},
    open: false,
    hmr: true
  }
  
  try {
    if (configPath && existsSync(configPath)) {
      const userConfig = require(configPath)
      if (userConfig && userConfig.server) {
        config = { ...config, ...userConfig.server }
      }
    }
  } catch (error) {
    console.warn(`서버 설정 로드 실패: ${error.message}`)
  }
  
  return config
}

// HTTPS 서버 생성
export function createSecureServer(config, handler) {
  let key, cert
  
  if (config.https === true) {
    // 기본 인증서 경로
    const keyPath = join(process.cwd(), 'localhost-key.pem')
    const certPath = join(process.cwd(), 'localhost-cert.pem')
    
    if (existsSync(keyPath) && existsSync(certPath)) {
      key = readFileSync(keyPath)
      cert = readFileSync(certPath)
    } else {
      console.warn('HTTPS 인증서를 찾을 수 없습니다. HTTP로 대체합니다.')
      return null
    }
  } else if (typeof config.https === 'object') {
    // 사용자 지정 인증서
    key = config.https.key
    cert = config.https.cert
  }
  
  if (key && cert) {
    return createHttpsServer({ key, cert }, handler)
  }
  
  return null
}

// CORS 헤더 설정
export function setCorsHeaders(res, config) {
  if (!config.cors) return
  
  const cors = config.cors === true
    ? {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204
      }
    : config.cors
  
  res.setHeader('Access-Control-Allow-Origin', cors.origin)
  res.setHeader('Access-Control-Allow-Methods', cors.methods)
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (cors.credentials) {
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }
}

// 프록시 요청 처리
export async function handleProxyRequest(req, proxyConfig) {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const pathname = url.pathname
  
  for (const [prefix, options] of Object.entries(proxyConfig)) {
    if (pathname.startsWith(prefix)) {
      try {
        // 대상 URL 구성
        const target = new URL(options.target)
        const proxyPath = pathname.replace(new RegExp(`^${prefix}`), '')
        const proxyUrl = new URL(proxyPath, target)
        
        // 쿼리 파라미터 복사
        for (const [key, value] of url.searchParams.entries()) {
          proxyUrl.searchParams.set(key, value)
        }
        
        // 프록시 요청 헤더 설정
        const headers = { ...req.headers }
        
        // 호스트 헤더 변경
        headers.host = target.host
        
        // 원본 요청 메서드와 본문 유지
        const method = req.method
        const body = method !== 'GET' && method !== 'HEAD' ? await req.arrayBuffer() : undefined
        
        // 프록시 요청 실행
        const proxyRes = await fetch(proxyUrl.toString(), {
          method,
          headers,
          body,
          redirect: 'manual'
        })
        
        // 응답 구성
        const responseHeaders = {}
        proxyRes.headers.forEach((value, key) => {
          responseHeaders[key] = value
        })
        
        return new Response(await proxyRes.arrayBuffer(), {
          status: proxyRes.status,
          headers: responseHeaders
        })
      } catch (error) {
        console.error(`프록시 오류 (${pathname}):`, error.message)
        return new Response(`프록시 오류: ${error.message}`, { status: 502 })
      }
    }
  }
  
  return null
}