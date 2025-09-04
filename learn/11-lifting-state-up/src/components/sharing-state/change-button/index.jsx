import './style.css'

/**
 * ChangeButton 컴포넌트
 * @param {Object} props
 * @param {string} props.message - 감정 메시지
 * @param {() => void} props.onUpdate - 랜덤 인덱스 상태 업데이트 함수
 */
export default function ChangeButton({ message, onUpdate }) {
  return (
    <button type="button" className="change-button" onClick={onUpdate}>
      {message}
    </button>
  )
}
