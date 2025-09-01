import { useState } from 'react'
import DOMPurify from 'dompurify'
import { LearnSection } from '@/components'

export default function App() {
  const htmlCodes = [
    `<code>&lt;div&gt;</code> 요소 남용`,
    `필요하지 않은 <code>&lt;div&gt;</code> 남용은 DOM을 복잡하게 만들고, 유지보수를 어렵게 합니다.`,
    `과도한 <code>&lt;div&gt;</code> 사용은 코드의 가독성과 성능에 악영향을 줄 수 있습니다.`,
    `의미 없는 <code>&lt;div&gt;</code>가 많아지면 스타일 관리와 접근성이 저하됩니다.`,
  ]

  const [userInput, setUserInput] = useState(
    '<p>보안에 <strong>취약</strong></p>'
  )

  const sanitizedUserInput = DOMPurify.sanitize(userInput)

  return (
    <LearnSection title="안전하게 HTML 렌더링">
      <pre className="p-5 bg-slate-100 text-slate-800 text-sm whitespace-break-spaces leading-normal">
        {htmlCodes.join('')}
      </pre>
      <div className="flex flex-col gap-2 my-8">
        <label htmlFor="user-input">
          사용자 입력 (<abbr title="Cross Site Scripting">XSS</abbr> 공격에서
          보호)
        </label>
        <textarea
          type="text"
          id="user-input"
          className="input"
          cols={60}
          rows={3}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <output
          className="p-4 bg-slate-950 text-slate-50"
          dangerouslySetInnerHTML={{
            __html: sanitizedUserInput,
          }}
        />
      </div>
      <PrintHTMLCode htmlCodes={htmlCodes} />
    </LearnSection>
  )
}

function PrintHTMLCode({ htmlCodes }) {
  const sanitizedHeadline = DOMPurify.sanitize(htmlCodes.at(0))

  return (
    <section className="my-10 flex flex-col gap-2">
      <h2 className="text-xl font-semibold">
        <abbr title="Hyper Text Markup Language">HTML</abbr> 코드 렌더링
      </h2>
      <h3
        className="text-[18px] font-semibold"
        dangerouslySetInnerHTML={{
          __html: sanitizedHeadline,
        }}
      />
      <div role="group" className="flex flex-col gap-2">
        {htmlCodes.slice(1).map((htmlCode, i) => {
          const sanitizedHTMLCode = DOMPurify.sanitize(htmlCode)
          return (
            <p
              key={i}
              dangerouslySetInnerHTML={{
                __html: sanitizedHTMLCode,
              }}
            />
          )
        })}
      </div>
    </section>
  )
}
