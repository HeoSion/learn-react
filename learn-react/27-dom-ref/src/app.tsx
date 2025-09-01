import { useGSAP } from '@gsap/react'
import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import gsap from 'gsap'
import VanillaTilt, { type HTMLVanillaTiltElement } from 'vanilla-tilt'
import { AutoFocusInput, LearnSection } from '@/components'
import ClassRef from './components/class-ref'

export default function App() {
  const [visible, setVisible] = useState<boolean>(true)

  return (
    <LearnSection title="DOM 참조">
      <ClassRef />

      <button
        className="button mb-5"
        type="button"
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? '감춤' : '표시'}
      </button>
      {visible && <GsapDemoUseGSAP />}

      <div className="box size-20 bg-red-500 text-white grid place-content-center">
        box 1
      </div>
      <div className="box size-20 bg-amber-500 text-white grid place-content-center">
        box 2
      </div>
    </LearnSection>
  )
}

// --------------------------------------------------------------------------
// GSAP

gsap.registerPlugin(useGSAP)

function GsapDemoUseGSAP() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // 선택자
      gsap.to('.box', { x: 80, stagger: 0.3, delay: 0.3 })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef}>
      <figure className="box size-20 bg-black text-white grid place-content-center">
        박스
      </figure>
      <figure className="box size-20 bg-black text-white grid place-content-center">
        박스
      </figure>
      <figure className="box size-20 bg-black text-white grid place-content-center">
        박스
      </figure>
    </div>
  )
}

function GsapDemoRefCallback() {
  return (
    <div
      ref={(element) => {
        if (element) {
          const timeline = gsap.timeline({
            repeat: -1,
            defaults: { duration: 1.2, ease: 'power2.inOut' },
          })

          timeline
            .to(element, { x: window.innerWidth - 180 - 20 })
            .to(element, { y: window.innerHeight - 60 - 20 })
            .to(element, { x: 0 })
            .to(element, { y: 0 })
        }
      }}
    >
      <abbr title="Green Sock Animation Platform" className="text-5xl">
        GSAP
      </abbr>
    </div>
  )
}

function GsapDemo() {
  const gsapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = gsapRef.current

    if (element) {
      const timeline = gsap.timeline({
        repeat: -1,
        defaults: { duration: 1.2, ease: 'power2.inOut' },
      })

      timeline
        .to(element, { x: window.innerWidth - 180 - 20 })
        .to(element, { y: window.innerHeight - 60 - 20 })
        .to(element, { x: 0 })
        .to(element, { y: 0 })
    }

    return () => {}
  })

  return (
    <div ref={gsapRef}>
      <abbr title="Green Sock Animation Platform" className="text-5xl">
        GSAP
      </abbr>
    </div>
  )
}

// --------------------------------------------------------------------------
// Vanilla Tilt Effect

const TILT_OPTIONS = {
  'glare': true,
  'max-glare': 0.7,
  'scale': 1.2,
}

function VanillaTiltEffectDemo() {
  const [boxes] = useState(Array(3).fill(null))

  // 1. ref 속성 + 콜백(callback) 함수 설정 방법
  const _boxRefCallback = (element: HTMLElement) => {
    console.log('바닐라 틸티 3D 이펙트 설정')
    VanillaTilt.init(element, TILT_OPTIONS)

    // 클린업 (React 19+)
    return () => {
      console.log('바닐라 틸티 3D 이펙트 정리')
      ;(element as HTMLVanillaTiltElement).vanillaTilt.destroy()
    }
  }

  // 2.  ref 속성 + useRef 훅 + useEffect 훅 연결하는 방법
  const boxesRef = useRef<HTMLElement[]>([])

  useEffect(() => {
    const boxElements = boxesRef.current

    if (boxElements.length > 0) {
      for (const element of boxElements) {
        if (element) {
          console.log('바닐라 틸티 3D 이펙트 설정')
          console.log(element)
          VanillaTilt.init(element, TILT_OPTIONS)
        }
      }
    }

    return () => {
      if (boxElements.length > 0) {
        console.log('바닐라 틸티 3D 이펙트 정리')
        for (const element of boxElements) {
          ;(element as HTMLVanillaTiltElement).vanillaTilt?.destroy()
        }
      }
    }
  }, [])

  return (
    <div role="group" className="text-4xl space-y-2">
      {boxes.map((_, index) => (
        <figure
          key={index}
          // ref={_boxRefCallback}
          ref={(element) => {
            if (element) boxesRef.current.push(element)
          }}
          className="size-40 bg-black text-white grid place-content-center uppercase"
        >
          box {index + 1}
        </figure>
      ))}
    </div>
  )
}

// --------------------------------------------------------------------------
// Canvas Confetti

interface Size {
  width: number
  height: number
}

const getSize = (): Size => ({
  width: window.innerWidth,
  height: window.innerHeight,
})

function ConfettiDemo() {
  const [size, setSize] = useState<Size>(getSize)

  useEffect(() => {
    const handleResize = () => setSize(getSize)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // confetti 라이브러리에 canvas DOM 전달
    confetti.create(canvas, { resize: true })({
      particleCount: 190,
      spread: 180,
      origin: { y: 0.5 },
    })
  }

  return (
    <>
      <button type="button" className="button" onClick={handleConfetti}>
        폭죽 효과
      </button>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          zIndex: -1,
          top: 0,
          left: 0,
          ...size,
        }}
      />
    </>
  )
}

// --------------------------------------------------------------------------

function DOMRefDemo() {
  const [attach, setAttach] = useState<boolean>(true)

  // DOM 참조 (컴포넌트 렌더링 결과로 실제 DOM 요소 접근/조작)
  const pRef = useRef<HTMLParagraphElement>(null)

  // 값 참조 (웹 API의 타이머 값 참조)
  const intervalRef = useRef<Timeout>(undefined)

  useEffect(() => {
    const pElement = pRef.current

    pElement?.setAttribute('tabindex', '-1')
    pElement?.focus()

    intervalRef.current = setInterval(() => {
      console.log(new Date().toLocaleTimeString())
    }, 1000)

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="paragraphes space-y-2 [&_p]:text-gray-700 [&_p]:font-semibold">
      {attach && (
        <div className="bg-amber-300 p-5 pt-2.5 my-2">
          <p
            ref={pRef}
            className="focus:outline-16 outline-offset-4 outline-blue-500/40"
          >
            하나
          </p>
          <button
            className="button mt-2"
            onClick={() => {
              setAttach((a) => !a)
              clearInterval(intervalRef.current)
            }}
          >
            토글
          </button>
        </div>
      )}
      <p>둘</p>
      <p>셋</p>
    </div>
  )
}
