/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function Logo() {
  return React.createElement(
    'svg',
    {
      className: 'logo',
      'aria-label': '리액트',
      viewBox: '0 0 21 21',
      fill: 'none',
    },
    React.createElement(
      'g',
      { clipPath: 'url(#clip-0zk)' },
      React.createElement('path', {
        d: 'M10.5 12.45C11.6046 12.45 12.5 11.5546 12.5 10.45C12.5 9.34543 11.6046 8.45 10.5 8.45C9.39543 8.45 8.5 9.34543 8.5 10.45C8.5 11.5546 9.39543 12.45 10.5 12.45Z',
        fill: 'currentColor',
      }),
      React.createElement('path', {
        d: 'M10.5 14.95C16.0228 14.95 20.5 12.9353 20.5 10.45C20.5 7.96472 16.0228 5.95 10.5 5.95C4.97715 5.95 0.5 7.96472 0.5 10.45C0.5 12.9353 4.97715 14.95 10.5 14.95Z',
        stroke: 'currentColor',
      }),
      React.createElement('path', {
        d: 'M6.60289 12.7C9.36431 17.4829 13.3477 20.3529 15.5 19.1103C17.6523 17.8676 17.1585 12.9829 14.3971 8.2C11.6357 3.41707 7.65232 0.547105 5.5 1.78975C3.34768 3.03239 3.84146 7.91707 6.60289 12.7Z',
        stroke: 'currentColor',
      }),
      React.createElement('path', {
        d: 'M6.60289 8.2C3.84146 12.9829 3.34768 17.8676 5.5 19.1103C7.65232 20.3529 11.6357 17.4829 14.3971 12.7C17.1585 7.91707 17.6523 3.03239 15.5 1.78975C13.3477 0.547105 9.36431 3.41707 6.60289 8.2Z',
        stroke: 'currentColor',
      })
    ),
    React.createElement(
      'defs',
      {},
      React.createElement(
        'clipPath',
        { id: 'clip-0zk' },
        React.createElement('rect', {
          width: 21,
          height: 21,
          fill: '#fff',
          transform: 'translate(0 1)',
        })
      )
    )
  )
}

function Output(props) {
  const classNames = `output ${props.isAnimate ? 'is-animate' : ''}`.trim()

  return React.createElement(
    'output',
    { className: classNames },
    props.children
  )
}

function ShortcutInfo() {
  return (
    <p className="shortcut-info">
      <code>Shift + Enter</code> 키를 누르면 애니메이션이 다시 시작됩니다.
    </p>
  )
}

function App(props) {
  const isAnimate = props.count < props.targetCount ? true : false

  return (
    <div className="random-count-up">
      <Logo />
      <Output isAnimate={isAnimate}>{props.count}</Output>
      <ShortcutInfo />
    </div>
  )

  // return React.createElement(
  //   'div',
  //   { className: 'random-count-up' },
  //   React.createElement(Logo),
  //   React.createElement(Output, { isAnimate }, props.count),
  //   React.createElement(ShortcutInfo)
  // )
}

/* -------------------------------------------------------------------------- */
/* Vanilla JavaScript                                                         */
/* -------------------------------------------------------------------------- */

const MIN = 30
const MAX = 99

function getRandomMinMax(min = MIN, max = MAX) {
  if (min >= max) throw new Error('min 값이 max 값보다 크거나 같으면 안됩니다.')
  return Math.round(Math.random() * (max - min) + min)
}

function getRandomHue() {
  return getRandomMinMax(0, 360)
}

const ORIGIN_TITLE = document.title

let targetCount

function setTargetCount() {
  targetCount = getRandomMinMax()
}

function setDocumentTitle() {
  document.title = ORIGIN_TITLE + ` (${targetCount})`
}

function setAppRandomHue() {
  document.body.style.setProperty('--hue', getRandomHue())
}

let count = 0

const container = document.getElementById('container')

if (!container) throw new Error('문서에 #container 요소가 존재하지 않습니다.')

const reactDOMRoot = ReactDOM.createRoot(container)

/* -------------------------------------------------------------------------- */
/* Render React App                                                           */
/* -------------------------------------------------------------------------- */

function render() {
  const app = React.createElement(App, { count, targetCount })
  // JSX (웹 표준이 아니라서, 브라우저에서 해석 안되고 오류 발생)
  // const app = <App count={count} targetCount={targetCount} />
  reactDOMRoot.render(app)
}

/* -------------------------------------------------------------------------- */
/* Animation                                                                  */
/* -------------------------------------------------------------------------- */

let animateId

function animate() {
  count += 1

  if (count > targetCount) {
    return cancelAnimationFrame(animateId)
  }

  render()

  animateId = requestAnimationFrame(animate)
}

function play() {
  setTargetCount()
  setDocumentTitle()
  setAppRandomHue()
  animate()
}

function replay() {
  count = 0
  play()
}

/* -------------------------------------------------------------------------- */
/* Event Binding                                                              */
/* -------------------------------------------------------------------------- */

globalThis.addEventListener('load', () => {
  play()

  document.body.addEventListener('click', replay)
  document.body.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.code === 'Enter') replay()
  })
})
