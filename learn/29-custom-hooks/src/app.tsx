import { type ChangeEvent, type FormEvent, useState } from 'react'
import { createUser, deleteUser } from '@/api/users'
import { useMutation, usePersist } from '@/hooks'

export default function NicknamePersistExample() {
  const [nickname, setNickname, { remove }] = usePersist<string>(
    '@sion/nickname',
    ''
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
  }

  return (
    <main className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">닉네임 기억하기</h2>
      <input
        type="text"
        className="border px-3 py-2 rounded w-full mb-2 focus:ring-2 focus:ring-blue-400"
        placeholder="닉네임을 입력하세요"
        value={nickname}
        onChange={handleChange}
      />
      <div className="mt-3 text-gray-700">
        <span className="font-semibold">저장된 닉네임:</span>{' '}
        <span className="text-blue-600">{nickname || '없음'}</span>
        <button type="button" className="button" onClick={remove}>
          저장된 닉네임 삭제
        </button>
      </div>
    </main>
  )
}

function MutationExample() {
  // 생성용 상태
  const [name, setName] = useState('')

  // 생성 mutation 인스턴스
  const createMutation = useMutation({ mutateFn: createUser })

  // 생성 폼 제출 핸들러
  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return
    await createMutation.mutate(name)
    setName('')
  }

  // --------------------------------------------------------------------------

  // 삭제용 상태
  const [deleteName, setDeleteName] = useState('')

  // 삭제 mutation 인스턴스
  const deleteMutation = useMutation({ mutateFn: deleteUser })

  // 삭제 폼 제출 핸들러
  const handleDelete = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!deleteName.trim()) return
    await deleteMutation.mutate(deleteName)
    setDeleteName('')
  }

  return (
    <main className="max-w-md mx-auto p-8">
      <h2 className="text-xl font-bold mb-4">useMutation 실습</h2>

      {/* 사용자 등록 폼 */}
      <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-3">
        <label htmlFor="name" className="font-semibold">
          이름 입력
        </label>
        <input
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
          disabled={createMutation.isLoading}
          className={`px-4 py-2 border-0 border-blue-600 rounded font-semibold transition-colors
            ${
              createMutation.isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400'
            }`}
          aria-busy={createMutation.isLoading}
        >
          {createMutation.isLoading ? '등록중...' : '등록'}
        </button>
        <button
          type="button"
          onClick={createMutation.reset}
          className="px-4 py-2 border-1 border-gray-200 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-blue-400"
        >
          초기화
        </button>
      </form>

      {/* 등록 상태 및 결과 */}
      <section aria-live="polite" className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">등록 상태:</span>
          <span>{createMutation.status}</span>
        </div>
        {createMutation.hasError && (
          <div className="text-red-600" role="alert">
            <span className="font-semibold">에러:</span>{' '}
            {createMutation.error?.message}
          </div>
        )}
        {createMutation.isSuccess && (
          <div className="text-green-600">
            <span className="font-semibold">성공!</span> 사용자 등록됨
          </div>
        )}
      </section>

      <section>
        <span className="font-semibold">등록 응답 데이터:</span>
        <pre className="bg-gray-100 p-3 rounded text-xs mt-2 max-h-40 overflow-auto">
          {JSON.stringify(createMutation.data, null, 2)}
        </pre>
      </section>

      <hr className="mt-7 border-slate-300" />

      {/* 사용자 삭제 폼 */}
      <form onSubmit={handleDelete} className="my-6 flex flex-col gap-3">
        <label htmlFor="deleteName" className="font-semibold">
          삭제할 이름 입력
        </label>
        <input
          id="deleteName"
          type="text"
          value={deleteName}
          onChange={(e) => setDeleteName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="삭제할 이름을 입력하세요"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={deleteMutation.isLoading}
          className={`px-4 py-2 border-0 rounded font-semibold transition-colors
            ${
              deleteMutation.isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-400'
            }`}
          aria-busy={deleteMutation.isLoading}
        >
          {deleteMutation.isLoading ? '삭제중...' : '삭제'}
        </button>
        <button
          type="button"
          onClick={deleteMutation.reset}
          className="px-4 py-2 border-1 border-gray-200 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-red-400"
        >
          초기화
        </button>
      </form>

      {/* 삭제 상태 및 결과 */}
      <section aria-live="polite" className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">삭제 상태:</span>
          <span>{deleteMutation.status}</span>
        </div>
        {deleteMutation.error && (
          <div className="text-red-600" role="alert">
            <span className="font-semibold">에러:</span>{' '}
            {deleteMutation.error?.message}
          </div>
        )}
        {deleteMutation.isSuccess && (
          <div className="text-green-600">
            <span className="font-semibold">성공!</span> 사용자 삭제됨
          </div>
        )}
      </section>

      <section>
        <span className="font-semibold">삭제 응답 데이터:</span>
        <pre className="bg-gray-100 p-3 rounded text-xs mt-2 max-h-40 overflow-auto">
          {JSON.stringify(deleteMutation.data, null, 2)}
        </pre>
      </section>
    </main>
  )
}
