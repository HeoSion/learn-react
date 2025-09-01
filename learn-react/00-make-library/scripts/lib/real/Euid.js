export function createElement(elementType/* type */, properties = {}/* props */, ...children) {
  const element = document.createElement(elementType)

  for (let [key, value] of Object.entries(properties)) {
    if (key.includes('className')) key = 'class'
    element.setAttribute(key, value)
  }

  element.append(...children)

  return element
}

const Euid = Object.freeze({
  createElement,
})

export default Euid
