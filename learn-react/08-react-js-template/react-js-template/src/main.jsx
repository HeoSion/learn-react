import { createRoot } from 'react-dom/client'
import './styles/main.css'
import App from './app'

const container = document.getElementById('container')
if (!container) throw new Error('문서에 #container 요소가 존재하지 않습니다.')

createRoot(container).render(<App />)
