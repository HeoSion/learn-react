import { Component, createRef } from 'react'

export default class ClassRef extends Component {
  spanRef = createRef<HTMLSpanElement>()

  render() {
    return (
      <div className="border-4 my-5 border-indigo-500">
        <span ref={this.spanRef} className="p-5 block text-inherit">
          span
        </span>
      </div>
    )
  }

  componentDidMount() {
    this.spanRef.current?.style.setProperty(
      'color',
      'oklch(58.5% 0.233 277.117)'
    )
  }
}
