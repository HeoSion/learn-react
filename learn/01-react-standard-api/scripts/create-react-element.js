// react.element = 실제 DOM 요소 노드를 추상화한 객체
function createElement(type, props, ...children) {
  return {
    $$typeof: Symbol('react.element'),
    key: null,
    props: { ...props, children },
    ref: null,
    type,
  }
}

const h = createElement

const reactElement = h('div', {
  className: 'wrapper',
  children: 'division',
})

console.log(reactElement)
