import { type FormEvent, useCallback, useRef, useState } from 'react'
import { LearnSection } from '@/components'
import {
  useArray,
  useInput,
  useMutation,
  useQuery,
  useToggleState,
} from '@/hooks'
import { tw } from './utils'

const URL = {
  users: 'http://localhost:4000/users',
  posts: 'http://localhost:4000/posts',
  comments: 'http://localhost:4000/comments',
}

interface User {
  id: number
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
  phone: string
  company: {
    name: string
    catchPhrase: string
    business: string
  }
}

// 데이터 뮤테이션 비동기 함수
const createUser = async (name: string) => {
  return fetch('http://localhost:4000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
}

export default function MutationExample() {
  const [name, setName] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const mutation = useMutation<string, User>({
    mutateFn: createUser,
  })
  const { status, error, data, isLoading, hasError, isSuccess } = mutation

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      alert('이름을 작성하세요!')
      inputRef.current?.focus()
      return
    }

    await mutation.mutate(name)

    setName('')
  }

  return (
    <main className="max-w-md mx-auto p-8">
      <h2 className="text-xl font-bold mb-4">useMutation 실습</h2>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3">
        <label htmlFor="name" className="font-semibold">
          이름 입력
        </label>
        <input
          ref={inputRef}
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="이름을 입력하세요"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={isLoading || !name.trim()}
          className={`px-4 py-2 border-1 border-blue-600 rounded font-semibold transition-colors
            ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400'
            }`}
          aria-busy={isLoading}
        >
          {isLoading ? '등록중...' : '등록'}
        </button>
        <button
          type="button"
          onClick={mutation.reset}
          className="px-4 py-2 border-1 border-gray-300 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400"
        >
          초기화
        </button>
      </form>

      <section aria-live="polite" className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">상태:</span>
          <span>{status}</span>
        </div>
        {hasError && (
          <div className="text-red-600" role="alert">
            <span className="font-semibold">에러:</span> {error?.message}
          </div>
        )}
        {isSuccess && (
          <div className="text-green-600">
            <span className="font-semibold">성공!</span> 사용자 등록됨
          </div>
        )}
      </section>

      <section>
        <span className="font-semibold">응답 데이터:</span>
        <pre className="bg-gray-100 p-3 rounded text-xs mt-2 max-h-40 overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </section>
    </main>
  )
}

function UseQueryDemo() {
  const [selectedUrl, setSelectedUrl] = useState<string>(URL.users)
  const queryData = useQuery(selectedUrl)

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">useQuery 테스트</h1>
      <section className="mb-6">
        <h2 className="font-semibold mr-4">API 선택:</h2>
        <div
          role="group"
          aria-label="API 엔드포인트 선택"
          className="inline-flex gap-2"
        >
          {Object.entries(URL).map(([key, url]) => {
            const isSelected = selectedUrl === url
            const classNames = tw(
              'px-3 py-1 rounded border text-sm font-medium transition-colors',
              isSelected &&
                'bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed',
              isSelected ||
                'bg-white border-gray-300 hover:bg-blue-50 focus:bg-blue-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
            )
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedUrl(url)}
                aria-pressed={selectedUrl === url}
                aria-label={`${key} 데이터 불러오기`}
                disabled={selectedUrl === url}
                className={classNames}
              >
                {key}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={queryData.refetch}
          aria-label="데이터 다시 불러오기"
          className="ml-6 px-3 py-1 rounded border border-blue-500 bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
        >
          리페치
        </button>
      </section>

      <section aria-live="polite" className="mb-6">
        <div className="flex items-center gap-2">
          <span className="font-semibold">상태:</span>
          <span className="text-gray-700">{status}</span>
          {queryData.isLoading && (
            <span className="ml-2 animate-pulse text-blue-500">로딩중...</span>
          )}
        </div>
        {queryData.hasError && (
          <div className="mt-2 text-red-600" role="alert">
            <span className="font-semibold">에러:</span>{' '}
            {(queryData.error as unknown as Error)?.message}
          </div>
        )}
      </section>

      <section>
        <span className="font-semibold">데이터:</span>
        <pre className="bg-gray-100 p-3 rounded text-xs mt-2 max-h-72 overflow-auto">
          {JSON.stringify(queryData.data, null, 2)}
        </pre>
      </section>

      <hr />

      <FetchPostDataDemo />
    </main>
  )
}

interface Post {
  userId: number
  id: number
  title: string
  body: string
}

function FetchPostDataDemo() {
  const { isLoading, hasError, error, data } = useQuery<Post[]>(URL.posts)

  if (isLoading) {
    return <div role="status">포스트 데이터 로딩 중...</div>
  }

  if (hasError) {
    return <div role="alert">{error?.message}</div>
  }

  return <output>{data?.length ?? 0}</output>
}

// --------------------------------------------------------------------------
// useArray 훅 데모

function UseArrayDemo() {
  const arrayData = useArray<number>([3, 6, 9])

  return (
    <div className="p-20">
      <div role="group" className="my-10 flex gap-3 flex-wrap">
        <button type="button" onClick={() => arrayData.set([9, 36, 81])}>
          [9, 36, 81]로 설정
        </button>
        <button type="button" onClick={() => arrayData.push(12)}>
          뒤에 12 추가
        </button>
        <button type="button" onClick={() => arrayData.unshift(11, 73)}>
          앞에 11, 73 추가
        </button>
        <button type="button" onClick={() => arrayData.replace(1, 16)}>
          두 번째 요소를 16으로 교체
        </button>
        <button type="button" onClick={() => arrayData.replace(2, 100)}>
          세 번째 요소를 100으로 교체
        </button>
        <button type="button" onClick={() => arrayData.filter((n) => n < 24)}>
          24보다 작은 수만 필터링
        </button>
        <button type="button" onClick={() => arrayData.remove(2)}>
          세 번째 요소 제거
        </button>
        <button type="button" onClick={arrayData.clear}>
          모두 제거
        </button>
        <button type="button" onClick={arrayData.reset}>
          초기화
        </button>
      </div>
      <output className="text-3xl">{arrayData.array?.join(', ')}</output>
    </div>
  )
}

// --------------------------------------------------------------------------

function UsingCustomHooksDemo() {
  const inputProps = useInput(99)

  const [darkTheme, toggleDarkTheme] = useToggleState(true)

  const themeClassNames = darkTheme ? 'bg-slate-950 text-white' : ''
  const checkeboxLabel = darkTheme ? '라이트 테마 전환' : '다크 테마 전환'

  return (
    <LearnSection
      title="사용자 정의 훅 (Custom Hooks)"
      showTitle
      className={tw('p-10 h-screen', themeClassNames)}
    >
      <div role="group" className="flex gap-1 items-center">
        <input
          type="checkbox"
          id="theme-checkbox"
          checked={darkTheme}
          onChange={toggleDarkTheme}
        />
        <label htmlFor="theme-checkbox" className="select-none">
          {checkeboxLabel}
        </label>
      </div>
      <div role="group" className="flex flex-col gap-2 my-4">
        <label htmlFor="number-input">숫자</label>
        <input
          type="number"
          id="number-input"
          className="my-2"
          min={0}
          max={10}
          {...inputProps}
        />
      </div>
      <output>{inputProps.value}</output>
      <CustomHookDemo />
    </LearnSection>
  )
}

function CustomHookDemo() {
  const inputProps = useInput('reusable logic')

  const [toggle, setToggle] = useToggleState(true)
  const language = toggle ? 'ko' : 'en'
  const isKorean = language.includes('ko')

  return (
    <>
      <div role="group" className="flex flex-col gap-2 my-4">
        <label htmlFor="user-input">이름</label>
        <input type="text" id="user-input" className="my-2" {...inputProps} />
        <output>{inputProps.value || '이름 값 출력'}</output>
      </div>
      <button
        type="button"
        className="select-none cursor-pointer bg-black text-white p-2"
        lang={isKorean ? 'en' : 'ko'}
        onClick={setToggle}
      >
        {isKorean ? 'change english' : '한국어 전환'}
      </button>
    </>
  )
}

function Parent() {
  const [count, setCount] = useState(0)
  const update = useCallback(
    function () {
      // setCount(count + 1)
      setCount((c) => c + 1)
    },
    // [count]
    []
  )

  // useEffect(() => {
  //   update()
  // }, [update])

  return <Child count={count} update={update} />
}

interface ChildProps {
  count: number
  update: () => void
}

function Child({ count, update }: ChildProps) {
  return (
    <div className="p-12">
      <button type="button" className="text-xl" onClick={update}>
        {count}
      </button>
    </div>
  )
}
