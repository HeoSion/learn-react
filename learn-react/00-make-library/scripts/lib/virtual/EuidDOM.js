class EuidDOMRoot {
  #container = null

  constructor(container) {
    this.#container = container
  }

  #parseDOM(virtualElementTree) {
    const { type, props } = virtualElementTree

    const element = document.createElement(type)

    const { children, ...properties } = props

    for (let [key, value] of Object.entries(properties)) {
      if (key.includes('className')) key = 'class'
      element.setAttribute(key, value)
    }

    const childElements = children.map((child) => {
      if (typeof child === 'string') return child
      return this.#parseDOM(child)
    })

    element.append(...childElements)

    return element
  }

  render(virtualElementTree) {
    const element = this.#parseDOM(virtualElementTree)
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
