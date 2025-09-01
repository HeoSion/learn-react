export default function StatefulComponent({ className, style, ...restProps }) {
  let count = 9
  let prevCount = count
  let name = 'StatefulComponent'

  const handleUpdateName = () => {
    // 이름 상태 변경
    // 이처럼 직접 상태 값을 수정하려 시도하면 안됨!
    name = '함수 컴포넌트 상태 업데이트 시도'
    console.log('clicked handleUpdateName')
    console.log('name = ', name)
  }

  const handleUpdateCount = () => {
    prevCount = count
    count += 1
    console.log('clicked handleUpdateCount')
    console.log('prevCount = ', prevCount)
    console.log('count = ', count)
  }

  console.log('함수형 컴포넌트 렌더링')

  return (
    <article className={className} style={style} {...restProps}>
      <h2>상태가 있는 컴포넌트 (클래스 타입)</h2>
      <p>{name}</p>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          marginBlockEnd: 20,
        }}
      >
        <output>이전 카운트 값: {prevCount}</output>
        <output>업데이트된 카운트 값: {count}</output>
      </div>
      <div role="group">
        <button type="button" onClick={handleUpdateName}>
          이름 수정
        </button>
        <button type="button" onClick={handleUpdateCount}>
          카운트 수정
        </button>
      </div>
    </article>
  )
}
