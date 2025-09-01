import { useState } from 'react'
import { LearnSection } from '@/components'
import RandomCountUp from '@/demo/app'
import {
  ImpureComponent1,
  ImpureComponent2,
} from './components/impure-component.jsx'
import './pure-function/testable.js'

export default function App() {
  return (
    <>
      <ImpureComponent1 className="text-4xl" />
      <ImpureComponent1 className="text-4xl" />
      <ImpureComponent2 className="text-4xl text-yellow-300" />
      <ImpureComponent2 className="text-4xl text-yellow-300" />
    </>
  )
}

// 컴포넌트 외부 요인
const friends = ['명진', '준수', '현우']

function PureFunctionDemo() {
  // 기존 배열을 변형(mutation)
  // const friend = friends.splice(0, 1)

  // 새로운 배열 반환(❌ 변형 안함, immutation)
  const _friend = friends.slice(0, 1)
  // console.log({ _friend, friends })
  // console.log('App 렌더링')

  const [key, setKey] = useState(0)

  return (
    <LearnSection title="랜덤 카운트 업" className="flex flex-col items-center">
      <output>{friends.join(', ')}</output>
      <button
        type="button"
        className="button my-2"
        onClick={() => setKey((k) => k + 1)}
      >
        다시 실행
      </button>
      <RandomCountUp key={key} />
    </LearnSection>
  )
}
