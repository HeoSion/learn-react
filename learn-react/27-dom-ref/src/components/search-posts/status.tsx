import type { PropsWithChildren } from 'react'

export default function Status({ children }: PropsWithChildren) {
  return (
    <div
      role="status"
      className="bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded text-center"
    >
      {children}
    </div>
  )
}
