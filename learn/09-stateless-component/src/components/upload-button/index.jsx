import SvgIcon, { ICON_TYPES } from '../svg-icon'
import { UPLOAD_LABEL, UPLOAD_STATUS } from './constants'
import './style.css'

/**
 * UploadButton 컴포넌트
 * 상태에 따라 다른 아이콘과 텍스트를 표시합니다.
 *
 * @param {Object} props
 * @param {string} props.status - 버튼 상태 ('idle', 'loading', 'resolved', 'rejected')
 * @param {boolean} props.disabled - 버튼 비활성화 여부
 */
export default function UploadButton({
  status = UPLOAD_STATUS.IDLE,
  disabled = false,
}) {
  // 상태에 따른 레이블 결정 (없는 상태면 기본값 사용)
  const buttonLabel = UPLOAD_LABEL[status] ?? UPLOAD_LABEL.IDLE

  // 상태와 disabled 여부에 따른 아이콘 타입 결정
  const iconType = disabled
    ? ICON_TYPES.NOT_ALLOWED
    : getIconTypeByStatus(status)

  return (
    <button type="button" className="upload-icon" disabled={disabled}>
      <span className="upload-button__label">{buttonLabel}</span>
      <SvgIcon type={iconType} label="" color="currentColor" />
    </button>
  )
}

// 업로드 상태 상수 내보내기
export { UPLOAD_STATUS }

/**
 * 상태에 따른 아이콘 타입을 반환하는 유틸리티 함수
 * @param {string} status - 버튼 상태
 * @returns {string} 아이콘 타입
 */
function getIconTypeByStatus(status) {
  const iconMap = {
    [UPLOAD_STATUS.IDLE]: ICON_TYPES.UP_ARROW,
    [UPLOAD_STATUS.LOADING]: ICON_TYPES.SPINNER,
    [UPLOAD_STATUS.RESOLVED]: ICON_TYPES.CHECK_MARK,
    [UPLOAD_STATUS.REJECTED]: ICON_TYPES.CROSS,
  }

  return iconMap[status] || ICON_TYPES.UP_ARROW
}
