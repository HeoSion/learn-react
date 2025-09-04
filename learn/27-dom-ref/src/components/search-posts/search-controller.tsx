interface Props {
  onSearch: (query: string) => void
}

export default function SearchController({ onSearch }: Props) {
  const handleSearch = (query: string) => () => {
    onSearch(query)
  }

  return (
    <div role="group" className="flex gap-2 mb-4 justify-center">
      <button
        type="button"
        onClick={handleSearch('성공')}
        className="cursor-pointer bg-slate-100 hover:bg-indigo-100 text-indigo-800 px-3 py-1 rounded transition"
      >
        &quot;성공&quot;으로 검색
      </button>
      <button
        type="button"
        onClick={handleSearch('실패')}
        className="cursor-pointer bg-slate-100 hover:bg-indigo-100 text-indigo-800 px-3 py-1 rounded transition"
      >
        &quot;실패&quot;로 검색
      </button>
      <button
        type="button"
        onClick={handleSearch('')}
        className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-950 px-3 py-1 rounded transition"
      >
        초기화
      </button>
    </div>
  )
}
