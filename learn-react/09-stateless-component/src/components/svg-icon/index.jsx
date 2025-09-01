import { ICON_PATHS, ICON_TYPES } from './constants'
import './style.css'

/**
 * SVG 아이콘 컴포넌트
 * @param {Object} props
 * @param {string} props.type - 아이콘 타입 ('spinner', 'up-arrow', 'check-mark', 'cross', 'not-allowed')
 * @param {string} props.label - 접근성을 위한 레이블 (비어있을 경우, 표현 이미지 처리)
 * @param {number} props.size - 아이콘 크기
 * @param {string} props.color - 아이콘 색상
 */
export default function SvgIcon({
  type = ICON_TYPES.UP_ARROW,
  label = '',
  size = 16,
  color = '#525577',
}) {
  // 스피너 타입인 경우, 스피너 컴포넌트 렌더링
  if (type === ICON_TYPES.SPINNER) {
    return <Spinner label={label} size={size} color={color} />
  }

  // 그 외 나머지 아이콘 렌더링
  const path = ICON_PATHS[type] || ICON_PATHS[ICON_TYPES.UP_ARROW]
  const ariaProps = label ? { 'aria-label': label } : { 'aria-hidden': 'true' }

  return (
    <svg
      role="img"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 12 12"
      {...ariaProps}
    >
      <path fill={color} fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
  )
}

/**
 * Spinner 컴포넌트
 * @param {Object} props
 * @param {string} props.label - 접근성을 위한 레이블 (비어있을 경우, 표현 이미지 처리)
 * @param {number} props.size - 아이콘 크기
 * @param {string} props.color - 아이콘 색상
 */
function Spinner({ label, size = 16, color = '#525577' }) {
  const ariaProps = label ? { 'aria-label': label } : { 'aria-hidden': true }

  return (
    <svg
      role="img"
      width={size}
      height={size}
      stroke={color}
      viewBox="0 0 24 24"
      {...ariaProps}
    >
      <g className="spinner_V8m1">
        <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" />
      </g>
    </svg>
  )
}

// Spinner 컴포넌트와 아이콘 타입 상수 내보내기
export { ICON_TYPES, Spinner }
