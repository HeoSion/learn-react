import accordionData from './data.json'
import { Component, useState } from 'react'
import { AccordionItemClass } from './accordion-item'
import './accordion-list.css'

// --------------------------------------------------------------------------
// 함수형 컴포넌트
// --------------------------------------------------------------------------

export function AccordionList({ onlyOneOpen = false }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const handleActiveIndex = (nextActiveIndex) => setActiveIndex(nextActiveIndex)

  return (
    <section className="accordion-section">
      <h2>
        자주 묻는 질문
        <img
          src="/assets/tutor@2x.png"
          alt="피그마 튜터"
          width={43}
          height={43}
        />
      </h2>
      <dl className="accordion-list">
        {accordionData.map((accordionItem, index) => (
          <AccordionItemClass
            key={accordionItem.id}
            question={accordionItem.question}
            answer={accordionItem.answer}
            isOpen={activeIndex === index}
            index={index}
            onActive={handleActiveIndex}
            onlyOneOpen={onlyOneOpen}
          />
        ))}
      </dl>
    </section>
  )
}

// --------------------------------------------------------------------------
// 클래스 컴포넌트
// --------------------------------------------------------------------------

/**
 * AccordionListClass 컴포넌트
 * @param {Object} props
 * @param {boolean} props.onlyOneOpen - 단 하나의 아코디언 아이템만 열 수 있도록 설정
 */
export class AccordionListClass extends Component {
  // 상태 선언
  // 클래스 필드 구문 활용
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: 0,
    }

    this.handleActiveIndex = this.handleActiveIndex.bind(this)
  }

  // 이벤트 핸들러
  handleActiveIndex(nextActiveIndex) {
    // 상태 업데이트
    this.setState(
      {
        activeIndex: nextActiveIndex,
      },
      () => {
        console.log(this.state.activeIndex)
      }
    )
  }

  render() {
    const { onlyOneOpen = false } = this.props
    const { activeIndex } = this.state

    return (
      <section className="accordion-section">
        <h2>
          자주 묻는 질문
          <img
            src="/assets/tutor@2x.png"
            alt="피그마 튜터"
            width={43}
            height={43}
          />
        </h2>
        <dl className="accordion-list">
          {accordionData.map((accordionItem, index) => (
            <AccordionItemClass
              key={accordionItem.id}
              question={accordionItem.question}
              answer={accordionItem.answer}
              isOpen={activeIndex === index}
              index={index}
              onActive={this.handleActiveIndex}
              onlyOneOpen={onlyOneOpen}
            />
          ))}
        </dl>
      </section>
    )
  }
}
