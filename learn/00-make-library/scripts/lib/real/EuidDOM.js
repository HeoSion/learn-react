class EuidDOMRoot {
  #container = null

  constructor(container) {
    this.#container = container
  }

  // mount
  render(element) {
    this.#container.append(element)
  }

  unmount() {
    this.#container.firstElementChild.remove()
  }
}

export function createRoot(container) {
  if (container?.nodeType !== document.ELEMENT_NODE) {
    throw new Error('EuidDOM.createRoot() 함수에는 실제 DOM 요소 노드가 전달되어야 합니다.')
  }

  return new EuidDOMRoot(container)
}

const EuidDOM = Object.freeze({
  createRoot,
})

export default EuidDOM
