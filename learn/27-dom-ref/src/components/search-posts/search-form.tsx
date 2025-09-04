import type { FormEvent } from 'react'

interface Props {
  query: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export default function SearchForm({ query, onSubmit }: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row gap-2 items-stretch mb-6"
      autoComplete="off"
    >
      <label htmlFor="search" className="sr-only">
        검색어
      </label>
      <input
        id="search"
        name="search"
        type="text"
        defaultValue={query}
        placeholder="검색어를 입력하세요"
        className="flex-1 rounded-md border border-slate-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />
      <button
        type="submit"
        className="cursor-pointer bg-indigo-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
      >
        검색
      </button>
    </form>
  )
}
