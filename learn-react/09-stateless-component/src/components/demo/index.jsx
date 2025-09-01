import './style.css'

/**
 * Demo 컴포넌트
 * @param {Object} props
 * @param {boolean} props.col - 레이아웃 방향 (row | column)
 * @param {React.ReactNode} props.children - 리액트 노드
 */
export default function Demo({ col = false, children }) {
  return <div className={`demo ${col ? 'col' : ''}`.trim()}>{children}</div>
}
