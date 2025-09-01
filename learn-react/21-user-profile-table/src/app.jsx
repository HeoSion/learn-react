import { useEffect, useState } from 'react'
import { LearnSection } from '@/components'
import { wait } from './utils'

export default function App() {
  return (
    <LearnSection title="사용자 프로필 테이블" className="p-10">
      <UserProfileTable />
    </LearnSection>
  )
}

function UserProfileTable() {
  // pending, error, data 상태 선언
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  // 부수 효과 (서버에서 데이터 가져오기)
  // - axios / Fetch API
  // - Promise / 비동기(async) 함수 + try...catch
  // 부수 효과 정리
  // - 이전 요청에 따른 상태 업데이트 무시
  // - 이전 요청 중단

  useEffect(() => {
    // 상태 업데이트
    setIsPending(true)
    setError(null)

    // 이전 요청 중단
    const controller = new AbortController()

    // 이전 요청 무시
    let ignore = false

    async function fetchUsers() {
      try {
        await wait(1.2)

        const response = await fetch('http://localhost:4000/users', {
          signal: controller.signal,
        })

        if (!response.ok && response.status === 404) {
          throw new Error('데이터베이스에 사용자 정보가 없습니다.')
        }

        const userData = await response.json()

        // 이전 요청 무시
        if (!ignore) {
          console.log('데이터 가져오기 -> 뷰 렌더링')
          setData(userData)
        }
      } catch (error) {
        if (error.name === 'AbortError') return
        setError(error)
      } finally {
        setIsPending(false)
      }
    }

    fetchUsers()

    return () => {
      ignore = true
      controller.abort()
    }
  }, [])

  // 조건부 렌더링
  // - pending 상태일 때
  // - error 상태일 때
  // - data 응답 결과가 있을 때

  if (isPending) {
    return (
      <div role="status" aria-live="polite" className="text-2xl text-sky-600">
        사용자 데이터 로딩 중...
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex flex-col gap-2 text-2xl bg-red-600 text-red-50 p-4 fixed top-0 left-0 right-0"
      >
        <h3 className="text-xl font-semibold">{error.name}</h3>
        <p className="text-base">{error.message} 추후 다시 시도해주세요.</p>
      </div>
    )
  }

  return (
    <table className="min-w-200 border-2 border-sky-900">
      <caption className="sr-only">사용자 프로필</caption>
      <thead>
        <tr>
          <th scope="col" className="p-1 border-1  border-sky-900 bg-sky-50">
            이름
          </th>
          <th scope="col" className="p-1 border-1  border-sky-900 bg-sky-50">
            아이디
          </th>
          <th scope="col" className="p-1 border-1  border-sky-900 bg-sky-50">
            이메일
          </th>
          <th scope="col" className="p-1 border-1  border-sky-900 bg-sky-50">
            도시
          </th>
          <th scope="col" className="p-1 border-1  border-sky-900 bg-sky-50">
            회사명
          </th>
          <th scope="col" className="p-1 border-1  border-sky-900 bg-sky-50">
            슬로건
          </th>
          <th scope="col" className="p-1 border-1  border-sky-900 bg-sky-50">
            주요사업
          </th>
        </tr>
      </thead>
      <tbody>
        {data?.map(({ id, name, username, email, address, company }) => {
          return (
            <tr key={id}>
              <td className="p-1 border-1 text-center border-sky-900">
                {name}
              </td>
              <td className="p-1 border-1 text-center border-sky-900">
                <code>{username}</code>
              </td>
              <td className="p-1 border-1 text-center border-sky-900">
                <a
                  href={`email:${email}`}
                  className="text-sky-600 hover:text-sky-700"
                >
                  {email}
                </a>
              </td>
              <td className="p-1 border-1 text-center border-sky-900">
                {address.city}
              </td>
              <td className="p-1 border-1 text-center border-sky-900">
                {company.name}
              </td>
              <td className="p-1 border-1 text-center border-sky-900">
                {company.catchPhrase}
              </td>
              <td className="p-1 border-1 text-center border-sky-900">
                {company.business}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
