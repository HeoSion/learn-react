import { useId, useState } from 'react'
import './style.css'

/**
 * UpdateInput 컴포넌트
 * @param {Object} props
 * @param {string} props.label - 인풋 요소의 레이블
 * @param {string} props.value - 인풋 요소의 초깃값
 */
export default function UpdateInput({ label, value }) {
  // console.log('UpdateInput 컴포넌트 렌더링')

  // 리액트 훅 함수를 사용해 함수형 컴포넌트의 상태 관리
  const [state, setState] = useState(value)
  const id = useId()

  // 이벤트 리스너
  const handleInput = (e) => {
    const nextState = e.target.value
    setState(nextState)
  }

  return (
    <>
      <div className="update-input">
        <label htmlFor={id}>{label}</label>
        <input id={id} type="text" defaultValue={state} onInput={handleInput} />
      </div>
      <output>{state || '입력된 상태 값'}</output>
    </>
  )
}
