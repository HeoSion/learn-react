/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Component } from 'react'
import './accordion-item.css'

// --------------------------------------------------------------------------
// 함수형 컴포넌트
// --------------------------------------------------------------------------

export function AccordionItem({
  index,
  question,
  answer,
  isOpen = false,
  onActive,
}) {
  const classNames = `accordion-item ${isOpen ? 'is-open' : ''}`.trim()
  const buttonLabel = isOpen ? '닫힘 전환' : '열림 전환'
  const handleActive = () => onActive?.(index)

  return (
    <div className={classNames}>
      <dt onClick={handleActive}>
        {question}{' '}
        <button type="button" aria-label={buttonLabel} aria-pressed={isOpen}>
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </dt>
      <dd className={isOpen ? 'is-open' : ''}>{answer}</dd>
    </div>
  )
}

// --------------------------------------------------------------------------
// 클래스 컴포넌트
// --------------------------------------------------------------------------

/**
 * AccordionItem 컴포넌트
 * @param {Object} props
 * @param {number} props.index - 질문/답변의 인덱스
 * @param {string} props.question - 자주 묻는 질문
 * @param {string} props.answer - 답변
 * @param {boolean} props.isOpen - 아코디언 아이템 열림/닫힘 여부
 * @param {(nextActiveIndex: number) => void} props.onActive - 아코디언 아이템 열리도록 설정하는 기능
 * @param {boolean} props.onlyOneOpen - 단 하나의 아코디언 아이템만 열 수 있도록 설정
 */
export class AccordionItemClass extends Component {
  // 상위 컴포넌트에서 전달한 isOpen 속성(props) 값에 의해 상태 값이 설정되도록 구성
  state = {
    open: this.props.isOpen,
  }

  // 외부로부터 전달된 데이터(props)로부터 파생된 상태 설정
  static getDerivedStateFromProps(props) {
    return props.onlyOneOpen
      ? {
          open: props.isOpen,
        }
      : null

    // 파생된 상태를 설정할 필요가 있다면? (객체 반환)
    // return {
    //   open: props.isOpen,
    // }

    // 상태 설정할 필요가 없다면?
    // return null
  }

  render() {
    // 속성(props)
    const { index, question, answer, onActive, onlyOneOpen } = this.props

    // 상태(state)
    const { open } = this.state

    const classNames = `accordion-item ${open ? 'is-open' : ''}`.trim()
    const buttonLabel = open ? '닫힘 전환' : '열림 전환'

    // 오직 하나만 열리도록 처리하는 기능(함수)
    const handleActive = () => onActive?.(index)

    // 각각의 아코디언 아이템을 열고 닫는 기능(함수)
    const handleToggle = () => this.setState({ open: !open })

    return (
      <div className={classNames}>
        <dt onClick={onlyOneOpen ? handleActive : handleToggle}>
          {question}{' '}
          <button type="button" aria-label={buttonLabel} aria-pressed={open}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </dt>
        <dd className={open ? 'is-open' : ''}>{answer}</dd>
      </div>
    )
  }
}
