import { type FormEvent, useId, useRef, useState } from 'react'
import { LearnSection } from './components'
import { useToggleState } from './hooks'

export default function App() {
  return (
    <>
      <title>{'리액트 폼 컨트롤 (제어 또는 제어되지 않는)'}</title>

      <div className="flex flex-col gap-8 p-10 bg-gray-50 min-h-screen">
        <LearnSection
          className="flex flex-col gap-2"
          title="제어 컴포넌트"
          showTitle
        >
          <ControlledInput />
        </LearnSection>

        <hr className="border-t-1 border-slate-300 w-full" />

        <LearnSection
          className="flex flex-col gap-2"
          title="비제어(제어되지 않은) 컴포넌트"
          showTitle
        >
          <UncontrolledInput />
        </LearnSection>

        {/* <LearnSection
          className="flex flex-col gap-2"
          title="클릭 폼 (Click Form)"
          showTitle
        >
          <ClickForm />
        </LearnSection> */}

        {/* <LearnSection
          className="flex flex-col gap-2"
          title="서브밋 폼 (Submit Form)"
          showTitle
        >
          <SubmitForm />
        </LearnSection> */}
      </div>
    </>
  )
}

function UncontrolledInput() {
  const emailRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!emailRef.current) return
    const { value: email } = emailRef.current
    if (email) alert(email)
  }

  console.log('UncontrolledInput 렌더링!')

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <label htmlFor="email-input">
        이메일 <span aria-label="필수 입력">*</span>
      </label>
      <input ref={emailRef} type="email" id="email-input" required />
      <button type="submit">구독</button>
    </form>
  )
}

function ControlledInput() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (email) alert(email)
  }

  console.log('ControlledInput 렌더링!')

  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <label htmlFor="email-input">
        이메일 <span aria-label="필수 입력">*</span>
      </label>
      <input
        type="email"
        id="email-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">구독</button>
    </form>
  )
}

function ClickForm() {
  const inputId = useId()
  const [value, setValue] = useState('')

  const handleClick = () => {
    alert(`입력값: ${value}`)
  }

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow"
      aria-labelledby="click-form-title"
    >
      <label htmlFor={inputId} className="sr-only">
        입력값
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="입력하세요"
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      />
      <button
        type="button"
        onClick={handleClick}
        className="bg-emerald-500 text-white rounded px-4 py-2 hover:bg-emerald-600 transition"
        aria-label="클릭 폼 제출"
      >
        제출
      </button>
    </form>
  )
}

function SubmitForm() {
  const inputId = useId()
  const [value, setValue] = useState('')

  const [checked, { toggle }] = useToggleState(false)

  const [comment, setComment] = useState('200자 내외로 댓글을 작성하세요.')
  const [gender, setGender] = useState('남성')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(`입력값: ${value}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow"
      aria-labelledby="submit-form-title"
    >
      <label htmlFor={inputId} className="sr-only">
        입력값
      </label>
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="입력하세요"
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <textarea
        aria-label="댓글 내용"
        className="p-2 border-1 border-blue-400"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="select-gender">성별</label>
        <select
          id="select-gender"
          className="border-2 border-sky-500 w-max p-1 pr-1.5 rounded"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="남성">남성</option>
          <option value="여성" /* selected */>여성</option>
        </select>
      </div>
      <div className="flex items-center gap-1">
        <input
          type="checkbox"
          id="checkbox-input"
          checked={checked}
          onChange={toggle}
        />
        <label htmlFor="checkbox-input">동의</label>
      </div>
      <button
        type="submit"
        className="bg-sky-500 text-white rounded px-4 py-2 hover:bg-sky-600 transition"
        aria-label="서브밋 폼 제출"
      >
        제출
      </button>
    </form>
  )
}
