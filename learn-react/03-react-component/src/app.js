import { Output, Logo, Shortcut } from './components/index.js'

export default function App(props) {
  return React.createElement(
    'div',
    { className: 'randomCountUpApp' },
    React.createElement(Logo),
    renderLists(3, props),
    React.createElement(Shortcut)
  )
}

function renderLists(length, props) {
  // React Render Lists + `key` prop
  console.log('render lists')

  return Array.from({ length }).map((_, index) =>
    React.createElement(
      Output,
      {
        // key: crypto.randomUUID(),
        key: index, // 0, 1, 2
        isAnimate: props.count < props.targetCount ? true : false,
      },
      props.count + index
    )
  )
}
