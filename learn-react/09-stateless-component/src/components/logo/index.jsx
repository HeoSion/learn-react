import { LOGO_COLOR, LOGO_PATH } from './constants'
import './style.css'

/**
 * Logo 컴포넌트
 * @param {Object} props
 * @param {'primary' | 'secondary'} props.type - 로고 타입
 * @param {boolean} props.outline - 로고 모양 (fill | outline)
 * @param {string} props.className - 사용자 정의 클래스 이름
 * @param {Object} props.style - 사용자 정의 인라인 스타일
 */
export default function Logo({
  type = 'primary',
  outline = false,
  className = '',
  style,
}) {
  let path = ''
  let color = ''

  const isPrimary = type === 'primary'

  if (isPrimary) {
    path = !outline ? LOGO_PATH.PRIMARY : LOGO_PATH.PRIMARY_OUTLINE
    color = LOGO_COLOR.PRIMARY
  } else {
    path = !outline ? LOGO_PATH.SECONDARY : LOGO_PATH.SECONDARY_OUTLINE
    color = LOGO_COLOR.SECONDARY
  }

  const colorAttr = { [outline ? 'stroke' : 'fill']: color }

  return (
    <svg
      role="img"
      aria-label="넷플릭스(Netflix)"
      className={`logo ${className}`.trim()}
      style={style}
      width={210}
      height={57}
      viewBox="0 0 210 57"
      fill="none"
    >
      <path d={path} {...colorAttr} />

      {/* {React.createElement('path', {
          d: path,
          ...colorAttr,
        })} */}
    </svg>
  )
}

// --------------------------------------------------------------------------
// 컴파운드 컴포넌트 패턴
// --------------------------------------------------------------------------
// React.Component
// React.Fragment
// --------------------------------------------------------------------------
// Logo.Primary
// Logo.PrimaryOutline
// Logo.Secondary
// Logo.SecondaryOutline
// --------------------------------------------------------------------------

Logo.Primary = (props) => <Logo {...props} />
Logo.PrimaryOutline = (props) => <Logo outline {...props} />
Logo.Secondary = (props) => <Logo type="secondary" {...props} />
Logo.SecondaryOutline = (props) => <Logo type="secondary" outline {...props} />
