import type { Post } from './api'

interface Props {
  data: Post[]
}

export default function SearchList({ data }: Props) {
  return (
    <ul className="space-y-6">
      {data?.map(({ id, title, body, user }) => (
        <li
          key={id}
          className="bg-white border border-slate-200 rounded-lg shadow-sm p-5"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
          <p className="text-slate-700 whitespace-pre-line mb-4">{body}</p>
          {user && (
            <div className="text-sm text-slate-500 space-y-0.5">
              <div>
                <span className="font-semibold text-slate-700">작성자:</span>{' '}
                <span>{user.name}</span>{' '}
                <span className="text-slate-400">({user.username})</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">이메일:</span>{' '}
                {user.email}
              </div>
              <div>
                <span className="font-semibold text-slate-700">회사:</span>{' '}
                {user.company && user.company.name}{' '}
                <span className="text-slate-400">
                  ({user.company && user.company.catchPhrase})
                </span>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
