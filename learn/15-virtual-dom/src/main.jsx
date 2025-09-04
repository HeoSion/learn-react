import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import './styles/main.css'

const root = document.getElementById('root')
if (!root) throw new Error('문서에 #root 요소가 존재하지 않습니다.')

// 브라우저 렌더링(페인팅) -> 실제 DOM에 반영
createRoot(root).render(<App />)
