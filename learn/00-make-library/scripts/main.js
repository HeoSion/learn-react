import { createElement as h /* hyperscript */ } from './lib/virtual/Euid.js'
import { createRoot } from './lib/virtual/EuidDOM.js'

const h1Element = h('h1', {}, h('code', {}, 'bunx'), ' 명령')

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

const app = h(
  'section',
  { className: 'bunx-introduction' },
  h1Element,
  pElement
)

createRoot(document.querySelector('main')).render(app)
