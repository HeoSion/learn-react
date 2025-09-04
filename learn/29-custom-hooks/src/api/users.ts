export interface User {
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

// 사용자 생성 함수
export const createUser = async (name: string) => {
  return fetch('http://localhost:4000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
}

// 사용자 삭제 함수 (이름 기반)
export const deleteUser = async (name: string) => {
  const user = await findUserByName(name)
  if (!user) throw new Error('사용자를 찾을 수 없습니다.')
  return deleteUserById(user.id)
}

export const findUserByName = async (name: string) => {
  const res = await fetch(
    `http://localhost:4000/users?name=${encodeURIComponent(name)}`
  )
  const users = await res.json()
  return users[0]
}

export const deleteUserById = async (id: number) => {
  return fetch(`http://localhost:4000/users/${id}`, {
    method: 'DELETE',
  })
}
