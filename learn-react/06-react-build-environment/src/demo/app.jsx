import { Output, Logo, ShortcutInfo } from './components'
import './app.css'

export default function App(props) {
  const isAnimate = props.count < props.targetCount ? true : false

  return (
    <div className="random-count-up">
      <Logo />
      <Output isAnimate={isAnimate}>{props.count}</Output>
      <ShortcutInfo />
    </div>
  )
}
