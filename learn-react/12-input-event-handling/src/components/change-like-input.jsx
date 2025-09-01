import { useEffect, useRef } from 'react'

/**
 * ChangeLikeInput 컴포넌트
 * @param {Object} props
 * @param {string} props.value - 사용자 입력 값
 * @param {(e: Event) => void} props.onChange - 웹 표준 change 이벤트 리스너
 */
export default function ChangeLikeInput({ value, onChange, ...restProps }) {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.value = value
  }, [value])

  const handleInput = (e) => {
    inputRef.current.value = e.target.value
  }

  const commit = (e) => {
    if (inputRef.current.value !== value) onChange?.(e)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      commit(e)
      e.target.blur()
    }
  }

  const handleBlur = (e) => commit(e)

  return (
    <input
      ref={inputRef}
      onChange={handleInput}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      {...restProps}
    />
  )
}
