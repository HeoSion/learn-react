export default function TodoList({ items, onUpdate, onDelete }) {
  // 파생된 상태 설정
  // 할 일 목록을 역순으로 정렬
  const reversedTodoList = items.toReversed()

  return (
    <section>
      <h2 className="sr-only">할 일 목록</h2>
      <ul className="todo-list">
        {reversedTodoList.map(({ id, doit, done }) => {
          return (
            <li key={id} className="list-item">
              <div className="form-control row">
                <input
                  id={id}
                  type="checkbox"
                  checked={done}
                  onChange={onUpdate(id)}
                />
                <label htmlFor={id} className="list-item-label">
                  {doit}
                </label>
              </div>
              <button type="button" onClick={onDelete(id)}>
                삭제
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
