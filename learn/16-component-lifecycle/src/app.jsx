import { useId, useState } from 'react'
import { LearnSection } from '@/components'
import LifeCycleDemo from './components/lifecycle/class'
import Practice from './components/lifecycle/practice'

export default function App() {
  console.log('App 렌더링')

  const [isShown, setIsShown] = useState(false)
  const [email, setEmail] = useState('yamoo9@naver.com')
  const [title, setTitle] = useState('App 컴포넌트')

  const id = useId()
  const emailId = `${id}-email`

  return (
    <section className="border-2 bg-indigo-700 text-white p-5 h-screen">
      <div className="flex gap-2 items-center mt-2.5 mb-4">
        <h1 className="text-xl font-extrabold">{title}</h1>
        <button
          type="button"
          className="button"
          onClick={() => setTitle((t) => '⚛️' + t)}
        >
          타이틀 변경
        </button>
      </div>
      <div role="group" className="flex flex-col gap-2 my-3">
        <label htmlFor={emailId} className="sr-only">
          이메일
        </label>
        <input
          type="email"
          name="email"
          id={emailId}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input bg-white text-indigo-500"
          placeholder="user@company.io"
        />
        <output className="p-2 px-5 border rounded w-max">{email}</output>
      </div>
      <p>
        Practice 컴포넌트의 상태는 "{isShown ? '마운트' : '언마운트'}"입니다.
      </p>
      <label className="block my-2">
        <input
          type="checkbox"
          checked={isShown}
          onChange={() => setIsShown((is) => !is)}
        />{' '}
        Practice {!isShown ? '마운트' : '언마운트'}
      </label>

      {isShown && <Practice email={email} />}
    </section>
  )
}

function LifeCycleDemoApp() {
  console.log('App 렌더링')

  const [description, setDescription] = useState(
    '라이프사이클은 특정 단계의 변화를 말합니다.'
  )

  const [isShown, setIsShown] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setDescription((d) => d + '⭐️')}
        className="button m-2"
      >
        설명 업데이트
      </button>

      <label className="m-5">
        <input
          type="checkbox"
          checked={isShown}
          onChange={() => setIsShown((is) => !is)}
        />{' '}
        라이프사이클 데모 {!isShown ? '표시' : '감춤'}
      </label>

      {isShown && <LifeCycleDemo desc={description} />}
    </>
  )
}

/* -------------------------------------------------------------------------- */

function LearnComponentLifecycle() {
  const [isVisible, setIsVisible] = useState(true)
  const handleInput = (e) => setIsVisible(e.target.checked)

  const [inputValue, setInputValue] = useState('Child 컴포넌트')
  const [headline, setHeadline] = useState('사자 보이즈')
  const updateHeadline = () => setHeadline((h) => h + '🦁')

  return (
    <LearnSection
      className="p-10"
      title="컴포넌트 라이프사이클(생명주기: 탄생(mount) -> 성장(update) -> 죽음(unmount))"
    >
      <label className="flex gap-1 items-center">
        <input
          type="checkbox"
          name="is-visible"
          checked={isVisible}
          onChange={handleInput}
        />
        Child 컴포넌트 표시 ({isVisible.toString()})
      </label>
      {isVisible ? (
        <Child
          headline={headline}
          updateHeadline={updateHeadline}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      ) : null}
    </LearnSection>
  )
}

// 컴포넌트 라이프사이클
// 1. 생성(mount)
// 2. 변경(update) x N
// 0. 소멸(unmount)
function Child({ headline, updateHeadline, inputValue, setInputValue }) {
  console.log('Child 렌더링')

  // 일반 변수 정의
  let count = 10

  return (
    <article className="mt-5 p-5 border-2 border-inherit">
      <h2 className="text-xl font-extrabold mb-2">{headline}</h2>
      <input
        type="text"
        className="input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="button" className="button mt-2" onClick={updateHeadline}>
        사자 이모지 추가
      </button>
      <button
        type="button"
        className="button mt-2"
        onClick={(e) => {
          // 이벤트 핸들러 (사용자에 의해 브라우저에서 실행)
          // 리액트 렌더링 프로세스와는 전혀 무관!!!!
          //
          // 명령형 프로그래밍
          //
          // 상태를 사용하지 않고 (가상 DOM을 사용하지 않고)
          // 직접 DOM에 접근/조작
          count = count + 10
          console.log(`updated count value = ${count}`)
          e.target.textContent = String(count)
          // 초점 이동시키고자 한다면?
          // 리액트가 못하는 일 (부수효과)
          document.querySelector('.input').select()
        }}
      >
        {count}
      </button>
    </article>
  )
}
