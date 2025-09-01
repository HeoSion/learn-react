import { Output, Logo, ShortcutInfo } from './components/index.js'

export default function App(props) {
  const isAnimate = props.count < props.targetCount ? true : false

  return React.createElement(
    'div',
    { className: 'random-count-up' },
    React.createElement(Logo),
    React.createElement(Output, { isAnimate }, props.count),
    React.createElement(ShortcutInfo)
  )
}
