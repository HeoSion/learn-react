export function getRandomCount(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

export function getRandomHueColor() {
  return getRandomCount(0, 360)
}

export function setAppColor() {
  document.body.style.setProperty('--hue', String(getRandomHueColor()))
}

const ORIGIN_TITLE = document.title

export function setDocumentTitle(targetCount: number) {
  document.title = `(${targetCount}) ${ORIGIN_TITLE}`
}
