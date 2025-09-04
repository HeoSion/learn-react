import React from 'react'
import { Output, Logo, ShortcutInfo } from './components/index.js'

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
