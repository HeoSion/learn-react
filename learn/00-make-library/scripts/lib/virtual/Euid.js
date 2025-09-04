export function createElement(elementType, properties = {}, ...children) {
  
  const { key = null, ref = null, ...props } = properties

  const virtualElement = {
    '$$typeof': Symbol('virtual.element'),
    key,
    ref,
    type: elementType,
    props: {
      ...props,
      children
    }
  }

  return virtualElement
}

const Euid = Object.freeze({
  createElement,
})

export default Euid
