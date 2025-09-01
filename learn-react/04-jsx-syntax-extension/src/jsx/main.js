import App from './app.js'

const MIN = 50
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

function render() {
  reactDOMRoot.render(<App count={count} targetCount={targetCount} />)
}

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

document.addEventListener('DOMContentLoaded', () => {
  play()

  document.body.addEventListener('click', replay)
  document.body.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.code === 'Enter') replay()
  })
})
