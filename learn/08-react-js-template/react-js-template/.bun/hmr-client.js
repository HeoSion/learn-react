// HMR 클라이언트 코드 - 브라우저에서 실행됨
;(function() {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = location.host
  const socket = new WebSocket(`${protocol}//${host}/__hmr`)

  let isConnected = false
  let pendingUpdates = []

  // 소켓 연결 이벤트
  socket.addEventListener('open', () => {
    console.log('[HMR] 연결됨')
    isConnected = true
    
    // 대기 중인 업데이트 처리
    if (pendingUpdates.length > 0) {
      pendingUpdates.forEach(update => handleUpdate(update))
      pendingUpdates = []
    }
  })

  // 메시지 수신 이벤트
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data)
    
    if (data.type === 'update') {
      if (isConnected) {
        handleUpdate(data)
      } else {
        pendingUpdates.push(data)
      }
    }
  })

  // 연결 종료 이벤트
  socket.addEventListener('close', () => {
    console.log('[HMR] 연결 종료됨. 재연결 시도...')
    isConnected = false
    // 일정 시간 후 재연결 시도
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  })

  // 에러 이벤트
  socket.addEventListener('error', (err) => {
    console.error('[HMR] 웹소켓 오류:', err)
  })

  // 업데이트 처리 함수
  function handleUpdate(data) {
    console.log('[HMR] 업데이트 수신:', data.path)
    
    const path = data.path
    const timestamp = Date.now()
    
    // CSS 파일 업데이트
    if (path.endsWith('.css')) {
      updateStyle(path, timestamp)
      return
    }
    
    // JS/JSX 파일 업데이트
    if (path.endsWith('.js') || path.endsWith('.jsx')) {
      // 모듈 캐시 무효화
      invalidateModule(path, timestamp)
      
      // 페이지 새로고침 (실제 HMR은 더 복잡한 로직 필요)
      window.location.reload()
      return
    }
    
    // 기타 파일은 페이지 새로고침
    window.location.reload()
  }

  // CSS 스타일 업데이트
  function updateStyle(path, timestamp) {
    // 기존 스타일 태그 찾기
    const links = document.querySelectorAll('link[rel="stylesheet"]')
    const styles = document.querySelectorAll('style')
    
    // 외부 스타일시트 업데이트
    for (const link of links) {
      const href = link.getAttribute('href')
      if (href && href.includes(path)) {
        const newHref = addTimestamp(href, timestamp)
        const newLink = document.createElement('link')
        newLink.rel = 'stylesheet'
        newLink.href = newHref
        
        newLink.onload = () => {
          // 로드 완료 후 이전 링크 제거
          link.parentNode.removeChild(link)
          console.log('[HMR] CSS 업데이트 완료:', path)
        }
        
        link.parentNode.insertBefore(newLink, link.nextSibling)
        return
      }
    }
    
    // 인라인 스타일 업데이트 (data-source 속성으로 식별)
    for (const style of styles) {
      const source = style.getAttribute('data-source')
      if (source && source.includes(path)) {
        // 새 스타일 요청
        fetch(`${path}?t=${timestamp}`)
          .then(res => res.text())
          .then(css => {
            style.textContent = css
            console.log('[HMR] 인라인 CSS 업데이트 완료:', path)
          })
          .catch(err => {
            console.error('[HMR] CSS 업데이트 실패:', err)
          })
        return
      }
    }
    
    // 찾지 못한 경우 페이지 새로고침
    console.log('[HMR] CSS 업데이트를 위해 페이지 새로고침')
    window.location.reload()
  }

  // 모듈 캐시 무효화
  function invalidateModule(path, timestamp) {
    // 실제 구현에서는 ES 모듈 시스템과 통합 필요
    console.log('[HMR] 모듈 캐시 무효화:', path)
  }

  // URL에 타임스탬프 추가
  function addTimestamp(url, timestamp) {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}t=${timestamp}`
  }

  // 개발 도구 콘솔에 HMR 상태 노출
  window.__HMR__ = {
    socket,
    isConnected: () => isConnected
  }
})()