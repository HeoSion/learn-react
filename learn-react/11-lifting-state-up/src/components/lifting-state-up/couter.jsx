import './counter.css'

// Stateless (상위 컴포넌트의 상태 변경 요청)
export default function Counter({ count = 0, setCount = () => {} }) {
  console.log('Counter 렌더링')

  return (
    <button
      type="button"
      className="counter"
      onClick={() => setCount((c) => c + 1)}
    >
      {count}
    </button>
  )
}
