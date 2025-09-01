import { useState } from 'react'
import { LearnSection } from '@/components'
import Parent from './components/virtual-dom/parent'

const INITIAL_TODOS = [
  {
    id: 0,
    text: '할 일 1',
    completed: true,
  },
]

export default function App() {
  console.log('App 렌더링')

  const [count, setCount] = useState(9)
  const [todos, setTodos] = useState(INITIAL_TODOS)

  // 컴포넌트 렌더링 -> 리액트 엘리먼트 트리 생성
  const reactElementTree = (
    <LearnSection title="가상(Virtual) DOM 작동 방식 이해" className="p-10">
      <Parent />
      <button
        type="button"
        onClick={() => setCount((c) => c + 2)}
        className="button mb-2"
      >
        {count}
      </button>
      <TodoList todos={todos} setTodos={setTodos} />
    </LearnSection>
  )

  // console.log(reactElementTree)

  return reactElementTree
}

function TodoList({ todos, setTodos }) {
  console.log('TodoList 렌더링')
  return (
    <>
      <button
        type="button"
        className="button mb-2"
        onClick={() => {
          const nextId = todos.length + 1

          setTodos((t) => [
            {
              id: nextId,
              text: `할 일 ${nextId}`,
              completed: false,
            },
            ...t,
          ])
        }}
      >
        할 일 추가
      </button>
      <ul data-id="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            {todo.text}
          </li>
        ))}
      </ul>
    </>
  )
}
