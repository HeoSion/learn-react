export default function AddTodoForm({ onAdd, inputProps }) {
  return (
    <section>
      <h2 className="sr-only">할 일 추가 폼</h2>
      <form className="new-todo-form" onSubmit={onAdd}>
        <div role="group" className="form-control grow">
          <label htmlFor="todo-input">새로운 할 일</label>
          <input type="text" id="todo-input" {...inputProps} />
        </div>
        <button className="button" type="submit">
          추가
        </button>
      </form>
    </section>
  )
}
