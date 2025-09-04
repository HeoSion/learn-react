import { FormEvent, useEffect, useState } from 'react'
import { type Post, fetchDataByQuery } from './api'
import Divider from './divider'
import ErrorComponent from './error'
import Loading from './loading'
import SearchController from './search-controller'
import SearchForm from './search-form'
import SearchList from './search-list'
import Status from './status'
import { getQueryFromLocation, queryPushInHistory } from './utils'

export default function SearchQueryDemo() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<Post[] | null>(null)

  // 검색 쿼리 초깃값을 현재 URL의 q 파라미터에서 가져오도록 설정
  // 참고: https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams

  // useEffect 훅을 사용해 마운트 이후, 브라우저 로케이션의 쿼리 스트링 값을 읽어서 리액트 앱과 동기화
  // useState 훅에 초기화 함수(동기적으로 작동)를 사용하면 useEffect 훅을 사용하지 않아도 됩니다.
  // /?q=열정
  // /?q=도전
  // /?q=사랑
  // /?q=성공
  // /?q=실패

  const [query, setQuery] = useState<string>(getQueryFromLocation)

  // 브라우저의 뒤로가기/앞으로 가기 버튼을 눌렀을 때(히스토리 이동에 반응해, 리액트 앱과 동기화)
  // 참고: https://developer.mozilla.org/ko/docs/Web/API/Window/popstate_event
  useEffect(() => {
    const handler = () => setQuery(getQueryFromLocation())

    globalThis.addEventListener('popstate', handler)

    return () => {
      globalThis.removeEventListener('popstate', handler)
    }
  }, [])

  // API에서 데이터 가져오기
  useEffect(() => {
    const abortController = new AbortController()
    setLoading(true)
    setError(null)

    fetchDataByQuery(query, { signal: abortController.signal })
      .then((result) => {
        if (result && !(result instanceof Error)) {
          setData(result)
        }
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false))

    return () => {
      abortController.abort()
    }
  }, [query])

  // 검색 폼 제출 시 쿼리 변경
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget) // <form>
    const nextQuery = formData.get('search') as string

    // URL 변경 시, query 상태 업데이트
    // JavaScript를 사용해 URL을 바꿀 때(사용자 액션에 반응해, 히스토리에 푸시)
    // 참고
    // - https://developer.mozilla.org/ko/docs/Web/API/History/pushState
    // - https://developer.mozilla.org/ko/docs/Web/API/URL/URL
    // ...

    queryPushInHistory(nextQuery)
    setQuery(nextQuery)
  }

  // 버튼 클릭으로 쿼리 변경
  const handleSearch = (nextQuery: string) => {
    // URL 변경 시, query 상태 업데이트
    // ...
    queryPushInHistory(nextQuery)
    setQuery(nextQuery)
  }

  const hasData = !loading && !error && data

  return (
    <section className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-medium mb-6 text-indigo-700 text-center">
        포스트 검색
      </h2>

      <SearchForm key={query} query={query} onSubmit={handleSubmit} />

      <SearchController onSearch={handleSearch} />

      <p className="mt-7 text-center text-slate-500 font-medium">
        {data?.length ?? 0}개의 포스트가 검색되었습니다.
      </p>

      <Divider />

      {loading && <Loading>검색 결과 로딩 중...</Loading>}
      {error && (
        <ErrorComponent>
          <strong>오류 발생!</strong> {String(error.message || error)}
        </ErrorComponent>
      )}
      {hasData && data.length === 0 && (
        <Status>
          <b className="text-indigo-700">&quot;{query}&quot;</b>으로 검색된
          결과가 없습니다.
        </Status>
      )}
      {hasData && data.length > 0 && <SearchList data={data} />}
    </section>
  )
}
