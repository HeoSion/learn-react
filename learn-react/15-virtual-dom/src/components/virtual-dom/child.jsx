import { useState } from 'react'

export default function Child() {
  console.log('Child 렌더링')

  const [headline, setHeadline] = useState('자식 컴포넌트')

  const handler = (e) => {
    e.stopPropagation()
    if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter')) {
      setHeadline((h) => h + '👏')
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className="my-5 p-5 border-2 border-amber-600"
      onClick={handler}
      onKeyDown={handler}
    >
      <h4 className="text-xl font-semibold text-amber-600">{headline}</h4>
    </div>
  )
}
