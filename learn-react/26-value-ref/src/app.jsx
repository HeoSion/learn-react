import { Component, useState } from 'react'
import { LearnSection } from '@/components'

// 사용자 정의 훅
function useRef(initialValue) {
  // 리액트의 빌트인(내장) 훅 사용 ✅
  const [ref] = useState({ current: initialValue })
  return ref
}

export default function App() {
  return (
    <LearnSection
      title="클래스 vs. 함수 값 참조"
      className="bg-slate-950 h-screen flex flex-col gap-4"
    >
      <TimerDemo />
      {/* <MemoPrevStateValue /> */}
      {/* <FunctionalComponent /> */}
      {/* <ClassComponent /> */}
    </LearnSection>
  )
}

// --------------------------------------------------------------------------

// 타이머 추가/제거 (타이머 추가 및 제거하기 위한 타이머 ID 기억)
// 다음 번에 렌더링 되더라도 값을 기억해야 타이머를 제거할 수 있음

function TimerDemo() {
  const [timer, setTimer] = useState(null)
  const timerIdRef = useRef() // { current: 3 }

  const handleStartTimer = () => {
    ;(function recursion() {
      clearTimeout(timerIdRef.current)
      timerIdRef.current = setTimeout(() => {
        console.log('타이머 작동 중...')
        setTimer(new Date())
        recursion()
      }, 1000)
    })()
  }

  const handleStopTimer = () => {
    console.log('타이머 중지!')
    clearTimeout(timerIdRef.current)
    setTimer(null)
  }

  return (
    <section
      aria-label="타이머 데모"
      className="bg-white text-black p-20 text-2xl flex flex-col gap-10"
    >
      <div role="group" className="space-y-3">
        <button type="button" className="button" onClick={handleStartTimer}>
          타이머 시작
        </button>
        <button type="button" className="button" onClick={handleStopTimer}>
          타이머 중지
        </button>
      </div>
      {timer && (
        <time dateTime={timer.toISOString()}>{timer.toLocaleTimeString()}</time>
      )}
    </section>
  )
}

// 이전 상태 값 기억 예시
function MemoPrevStateValue() {
  const [count, setCount] = useState(0)
  // useState를 사용해 useRef 흉내
  const prevCountRef = useRef(undefined) // { current: value }

  // useEffect(() => {
  //   // 렌더링될 때마다 이전 count 값을 저장
  //   prevCountRef.current = count
  // }, [count])

  return (
    <div className="bg-white text-blue-950 p-10 text-2xl">
      <p>현재 상태 값: {count}</p>
      <p>
        이전 상태 값: {prevCountRef.current ?? 'undefined'} (참조 객체의 current
        값)
      </p>
      <button
        type="button"
        className="button"
        onClick={() => {
          const nextCount = count + 1
          setCount(nextCount) // 다음 렌더링 시점의 상태 값
          prevCountRef.current = count
        }}
      >
        count 증가
      </button>
      <button
        type="button"
        className="button"
        onClick={() => {
          prevCountRef.current += 1
          console.log(prevCountRef.current)
        }}
      >
        prevCount 증가
      </button>
    </div>
  )
}

// 함수형 컴포넌트 + 메모이제이션(Memoization) 기능: 리액트 훅 함수
// 값 참조(기억) - useRef 훅 : 클래스 컴포넌트의 인스턴스 멤버처럼

function FunctionalComponent() {
  // 지역 변수는 렌더링 될 때마다 값이 초기화 값 기억 ❌
  // let message = '헬로 리액트!'

  // useRef 훅을 사용해 값 참조(기억) ✅
  const messageRef = useRef('HELLO 리액트!') // 일반 JS Object { current: 초깃값 }
  console.log(messageRef.current) // 기억된 현재 값

  const handleUpdateValue = () => {
    messageRef.current += '🍀'
    console.log(messageRef.current)
  }

  const handleResetRefValue = () => {
    messageRef.current = 'HELLO 리액트!'
    console.log('messageRef 현재 참조 값 초기화')
  }

  const [count, setCount] = useState(1)

  const handleUpdateState = () => {
    setCount(count + 1)
  }

  return (
    <section className="p-5 bg-yellow-300 text-black">
      <h2 className="font-extrabold text-xl mb-2">
        클래스 컴포넌트에서의 "값 참조(기억)"
      </h2>
      <p>컴포넌트 렌더링 할 때 마다 이전의 값을 기억할 수 있다.</p>
      <p>렌더링을 유발하지 않는 값을 기억하는 방법 (인스턴스 멤버 사용)</p>
      <button
        type="button"
        className="button block my-2"
        onMouseEnter={handleUpdateValue}
        onClick={handleUpdateState}
        onDoubleClick={handleResetRefValue}
      >
        메시지 변경 ({count})
      </button>

      <output className="text-4xl font-black text-blue-950 uppercase">
        {messageRef.current}
      </output>
    </section>
  )
}

class ClassComponent extends Component {
  state = {
    count: 1,
  }

  // 클래스 필드
  // 인스턴스 멤버
  // render 메서드(함수) 외부에 위치
  // 클래스 컴포넌트 내부에 위치
  // 렌더링 될 때마다 값을 기억하고, 변경할 수 있다.
  message = '헬로 리액트!' // 'Hello React'

  render() {
    // this.props

    // render 메서드(함수) 내부의 지역 변수는
    // 렌더링 될 때마다 초기화 (기억할 수 없다)
    // let message = 'Hello React'

    const handleUpdateInstanceMember = () => {
      this.message += '🍀'
      console.log(this.message)
    }

    const handleUpdateState = () => {
      this.setState({ count: this.state.count + 1 })
    }

    return (
      <section className="p-5 bg-yellow-300 text-black">
        <h2 className="font-extrabold text-xl mb-2">
          클래스 컴포넌트에서의 "값 참조(기억)"
        </h2>
        <p>컴포넌트 렌더링 할 때 마다 이전의 값을 기억할 수 있다.</p>
        <p>렌더링을 유발하지 않는 값을 기억하는 방법 (인스턴스 멤버 사용)</p>
        <button
          type="button"
          className="button block my-2"
          onMouseEnter={handleUpdateInstanceMember}
          onClick={handleUpdateState}
        >
          메시지 변경 ({this.state.count})
        </button>

        <output className="text-4xl font-black text-blue-950 uppercase">
          {this.message}
        </output>
      </section>
    )
  }
}
