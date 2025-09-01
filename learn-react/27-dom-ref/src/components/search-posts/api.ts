import { wait } from '@/utils'
import { fetchData, makeEndpoint } from './utils'

// API로 가져오는 데이터 타입 정의

export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  company: {
    name: string
    catchPhrase: string
    business: string
  }
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
  user?: User
}

// makeEndpoint 커링 함수를 사용해 API 호출 함수 생성
const api = makeEndpoint('http://localhost:4000')

export async function fetchUserbyId<U>(userId: User['id'], options = {}) {
  if (!userId) return
  return fetchData<U>(api(`users/${userId}`), options)
}

export const fetchDataByQuery = async (query: string, options = {}) => {
  await wait(0.65)

  const queryString = query ? `?q=${query}` : ''

  const postData = await fetchData<Post[]>(api(`posts${queryString}`), options)

  if (postData && !(postData instanceof Error)) {
    for (const item of postData) {
      const user = await fetchUserbyId<User>(item.userId, options)
      if (user && !(user instanceof Error)) {
        item.user = user
      }
    }
  }

  return postData
}
