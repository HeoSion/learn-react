export const makeEndpoint = (endpoint: string) => (path: string) =>
  `${endpoint}/${path}`

export const getQueryFromLocation = () => {
  const searchParams = new URLSearchParams(globalThis.location.search)
  const searchQuery = searchParams.get('q')
  return searchQuery ?? ''
}

export const queryPushInHistory = (nextQuery: string) => {
  const newUrl = new URL(globalThis.location.href)
  newUrl.searchParams.set('q', nextQuery)
  history.pushState({}, '', newUrl)
}

export async function fetchData<T>(
  url: string,
  options = {}
): Promise<T | void | Error> {
  if (!url) return

  try {
    const response = await fetch(url, options)
    if (!response.ok && response.status === 404)
      throw new Error(`검색된 결과를 찾을 수 없습니다.`)
    const data = response.json()
    return data
  } catch (error) {
    if ((error as Error).name === 'AbortError') return
    return error as Error
  }
}
