import { useState } from 'react'
import { LearnSection } from '@/components'
import {
  AccordionList,
  AccordionListClass,
} from './components/accordion/accordion-list'
import { Counter, CounterClass } from './components/counter'
import StatefulComponentClass from './components/stateful-component/class'
import StatefulComponent from './components/stateful-component/functional'
import UpdateInput from './components/update-input'

export default function App() {
  return <AccordionListClassDemo />
}

// --------------------------------------------------------------------------
// 실습 데모
// --------------------------------------------------------------------------

function FunctionalComponentObjectTypeStateDemo() {
  const [state, setState] = useState({ name: '하나', age: 1 })

  // [1]
  console.log(state) // state = { name: '하나', age: 1 }
  // [2]
  // console.log(state) // nextState = { ...state, name: 'ㅅ나' }
  // [3]
  // console.log(state) // nextState = { name: '세나' }

  return (
    <LearnSection title="함수형 컴포넌트의 객체 타입 상태 관리">
      <CounterClass />
      <Counter />

      <div className="form-group">
        <label htmlFor="name">이름</label>
        <input
          type="text"
          id="name"
          value={state.name}
          onInput={(e) =>
            setState((currentState) => ({
              ...currentState,
              name: e.target.value,
            }))
          }
        />
      </div>

      <div style={{ marginBlockStart: 30 }}>
        <button
          type="button"
          onClick={() => {
            const nextState = {
              ...state,
              age: state.age + 1,
            }

            setState(nextState)
          }}
        >
          {state.name} {state.age}
        </button>
      </div>
    </LearnSection>
  )
}

const getAge = () => {
  console.time('age state')
  // 계산에 많은 시간이 필요한 연산
  let ageValue = 2e9 // 약 1.7s
  while (--ageValue > 22) {
    // 의도적으로 계산에 많은 시간이 필요한 연산 시뮬레이션
  }
  console.timeEnd('age state')
  return ageValue
}

function FunctionalComponentStateDemo() {
  // --------------------------------------------------------------------------

  // 리액트 컴포넌트의 상태는 스냇샷처럼 작동
  // 스냅샷은 특정 시점의 데이터(불변)

  // --------------------------------------------------------------------------

  // 리액트 월드
  // 렌더 트리거 -> 리액트에 컴포넌트 렌더링 요청
  // 컴포넌트 렌더링 -> 리액트 엘리먼트 생성

  // --------------------------------------------------------------------------

  // 브라우저 월드
  // DOM 커밋 -> UI에 요소 추가/수정/삭제
  // 브라우저 렌더링(페인팅) -> 리플로우/리페인팅 (성능 이슈)

  // --------------------------------------------------------------------------

  const [name, setName] = useState('한창준')
  const handleChangeName = (e) => setName(e.target.value)

  // 초깃값 설정
  // useState(initialState)
  //
  // 초기화 함수 (initialization)
  // useState(() => initialState)
  const [age, setAge] = useState(getAge)

  const handleUpdateAge = () => {
    console.log({ age })
    const nextAge = age + 1
    setAge(nextAge) // 상태 업데이트 함수가 실행되면 리액트의 렌더 큐에 요청이 쌓인 후, 요청이 실행되면 -> 컴포넌트 렌더링
    console.log({ age, nextAge })
  }

  const handleTriggleAgeUpdate = () => {
    // 상태 업데이트 함수를 실행하는 것은
    // 리액트에게 상태 업데이트 요청
    // render trigger

    // React
    // console.log({ age }) // 22
    // 다음 번 렌더링
    // setAge(age + 2) // 22 + 2 = 24
    // setAge(age + 3) // 22 + 3 = 25
    // setAge(age + 1) // 22 + 1 = 23

    setAge((currentAge) => currentAge + 2) // 22 + 2 = 24
    setAge((currentAge) => currentAge + 3) // 24 + 3 = 27
    setAge((currentAge) => currentAge + 1) // 27 + 1 = 28

    // queue = [ (22) => 22 + 2, (24) => 24 + 3, (27) => 27 + 1 ]

    // console.log({ age }) // 22

    // JavaScript
    // let _age = 1
    // console.log({ _age }) // 1
    // _age = _age + 1 // 2
    // _age = _age + 1 // 3
    // _age = _age + 1 // 4
    // console.log({ _age }) // 4
  }

  return (
    <LearnSection title="함수형 컴포넌트의 상태 관리">
      {/* <UpdateInput label="이름" value="야무" /> */}
      {/* <UpdateInput label="직업" value="강사" /> */}
      <div className="form-group">
        <label htmlFor="name">이름</label>
        <input type="text" id="name" value={name} onChange={handleChangeName} />
      </div>

      <div style={{ marginBlockStart: 30 }}>
        <button type="button" onClick={handleUpdateAge}>
          {name} {age}
        </button>
        <button type="button" onClick={handleTriggleAgeUpdate}>
          + 3 actions
        </button>
      </div>
    </LearnSection>
  )
}

function AccordionListClassDemo() {
  return (
    <LearnSection title="상태 있는/없는 컴포넌트 구성">
      <AccordionListClass onlyOneOpen />
      <AccordionListClass />
    </LearnSection>
  )
}

function DescriptionComponentTypes() {
  return (
    <>
      <p>
        React에서 컴포넌트는 상태(state) 관리 여부에 따라 '상태 있는
        컴포넌트(Stateful Component)'와 '상태 없는 컴포넌트(Stateless
        Component)'로 구분됩니다.
      </p>
      <p>
        상태 없는 컴포넌트는 단순히 props를 받아 UI를 렌더링하는 순수 함수로,
        내부 상태를 관리하지 않아 예측 가능하고 테스트하기 쉽습니다. 반면 상태
        있는 컴포넌트는 내부적으로 데이터를 관리하고 변경할 수 있어 동적인 UI를
        구현하는 데 적합합니다.
      </p>
      <p>
        일반적으로 애플리케이션의 복잡성을 관리하기 위해 상태 관리가 필요한
        부분은 상태 있는 컴포넌트로, 단순 표시 목적의 UI는 상태 없는 컴포넌트로
        구현하는 것이 좋은 설계 원칙입니다.
      </p>
    </>
  )
}

function ClassVsFunctionalComponentDemo() {
  return (
    <LearnSection title="상태가 있는 컴포넌트" showTitle>
      {/* React.createElement(StatefulComponentClass) */}
      <StatefulComponentClass
        aria-describedby="component-description"
        data-component-type="class"
        className="mx-auto"
        style={{ display: 'grid' }}
      />
      <p id="component-description">
        클래스 컴포넌트는 React의 전통적인 방식으로, 내부 상태(state)를 관리하고
        라이프사이클 메서드를 사용할 수 있습니다. 'setState()' 메서드를 통해
        상태를 업데이트하며, 'render()' 메서드로 UI를 반환합니다. 함수형
        컴포넌트와 Hook이 도입된 이후에는 사용 빈도가 줄었지만, 여전히 많은
        프로젝트에서 사용되고 있습니다.
      </p>
      <StatefulComponent
        aria-describedby="functional-component-description"
        data-component-type="class"
        className="mx-auto"
        style={{ display: 'grid' }}
      />
      <p id="functional-component-description">
        함수형 컴포넌트는 React의 현대적인 접근 방식으로, Hook을 통해 상태
        관리와 생명주기 기능을 사용합니다. 'useState()' Hook으로 상태를 선언하고
        업데이트하며, 'useEffect()'로 생명주기 관련 작업을 처리합니다. 클래스
        컴포넌트보다 코드가 간결하고 가독성이 높으며, 컴포넌트 간 로직 재사용이
        용이하여 현재 React 개발의 표준 방식으로 자리잡았습니다.
      </p>
    </LearnSection>
  )
}
