import { createElement as h /* hyperscript */ } from './lib/virtual/Euid.js'
import { createRoot } from './lib/virtual/EuidDOM.js'

// Creating Elements
// Declarative Programming
// HTML 비교 (선언적 방식으로 마크업)
// <h1>
//   <code>bunx</code>
//   명령
// </h1>
const h1Element = h('h1', {}, h('code', {}, 'bunx'), ' 명령')

// <p>
//   <a href="..." target="..." rel="...">...</a>
//   ... <code>bunx</code> ... <code>npx</code> ...
// </p>
const pElement = h(
  'p',
  {},
  h(
    'a',
    {
      href: 'https://bun.sh',
      rel: 'noopener noreferrer',
      target: '_blank',
    },
    'Bun'
  ),
  '의 빠른 시작 덕분에, ',
  h('code', {}, 'bunx'),
  '는 로컬에 설치된 패키지 실행 시 ',
  h('code', {}, 'npx'),
  '보다 약 100배 빠릅니다.'
)

// <section class="bunx-introduction">
//   <h1>...</h1>
//   <p>...</p>
// </section>
const app = h(
  'section',
  { className: 'bunx-introduction' },
  h1Element,
  pElement
)

// Creating ReactDOMRoot Instance
// .render(createdElement)
// .unmount()
const root = createRoot(document.querySelector('main'))
console.log('앱 마운트')
root.render(app)

setTimeout(() => {
  console.log('앱 언마운트')
  root.unmount()
}, 2000)