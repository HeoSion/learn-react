import { Component, useState } from 'react'

export class CounterClass extends Component {
  state = {
    count: this.props.count || 0,
  }

  render() {
    const { count } = this.state

    return (
      <button
        type="button"
        onClick={() =>
          this.setState((s) => ({
            ...s,
            count: s.count + 1,
          }))
        }
      >
        {count}
      </button>
    )
  }
}

// --------------------------------------------------------------------------

export function Counter({ count: initialCount = 0 }) {
  const [count, setCount] = useState(initialCount)

  return (
    <button type="button" onClick={() => setCount((c) => c + 1)}>
      {count}
    </button>
  )
}
