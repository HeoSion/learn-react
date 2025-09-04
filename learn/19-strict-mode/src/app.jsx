import {
  Component,
  UNSAFE_componentWillMount,
  useEffect,
  useState,
} from 'react'
import { LearnSection } from '@/components'

export default function App() {
  // 리액트의 데이터 사용
  // - props
  return (
    <LearnSection title="랜덤 카운트 업">
      <BugComponent />
      <Counter value={2} />
      {/* <LegacyComponent /> */}
    </LearnSection>
  )
}

// --------------------------------------------------------------------------

class LegacyComponent extends Component {
  render() {
    return <div>레거시 컴포넌트</div>
  }

  // 더 이상 사용되지 않는 라이프사이클 메서드
  UNSAFE_componentWillMount() {
    console.log('컴포넌트 마운트 직전에 실행됨!\n(will mount === before mount)')
  }

  componentDidMount() {
    console.log('마운트 이후 실행, mounted')
  }
}

// --------------------------------------------------------------------------

// let globalCount = 0

// "순수하지 않은 함수" 예시
// function increaseGlobalCount() {
//   globalCount += 1
//   console.log('전역 변수:', globalCount)
// }

// 컴포넌트에서 호출
function Counter({ value = 0 }) {
  // console.log(`Counter 렌더링: ${globalCount}`)

  // 외부의 변수 또는 시스템 변경
  // 과연 이것이 리액트 렌더링과 관련이 있나?
  // increaseGlobalCount()

  return (
    <div className="my-2 py-2 px-6 bg-purple-100 text-purple-900 rounded-full">
      카운터: {value}
    </div>
  )
}

// --------------------------------------------------------------------------

// StrictMode를 사용하는 이유
// 리액트를 잘 모르고 사용하는 개발자의 실수 사전에 방지
//
// 리액트 렌더링 2회 실행 => 순수 함수인가? 확인
// 이펙트 2회 실행 => 부수 효과 클린업(정리)를 했나? 확인

function BugComponent() {
  console.log('BugComponent 렌더링')

  const [count, setCount] = useState(9)

  useEffect(
    () => {
      const handleClick = () => {
        console.log('클릭!')
      }

      document.addEventListener('click', handleClick)

      // 언마운트 1회 (정리 필요!)
      return () => {
        console.log('BugComponent 부수 효과 정리!!!')
        document.removeEventListener('click', handleClick)
      }
    },
    [] /* 마운트 또는 리마운트 시점에 1회 실행 */
  )

  return (
    <div className="bg-yellow-300 p-4 rounded-full">
      <button
        type="button"
        className="button rounded-full select-none active:scale-96"
        onClick={() =>
          setCount((c) => {
            if (c <= 0) return 0
            return c - 1
          })
        }
      >
        {count}
      </button>
    </div>
  )
}
