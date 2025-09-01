import getRandomHue from './get-random-hue.js'

export default function setAppRandomHue() {
  document.body.style.setProperty('--hue', getRandomHue())
}
