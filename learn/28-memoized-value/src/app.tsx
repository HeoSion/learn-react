import {
  ReactNode,
  // type DependencyList,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { LearnSection } from '@/components'
import { usePrev } from '@/hooks'

export default function App() {
  return (
    <LearnSection title="랜덤 카운트 업" className="p-10">
      <UseCallbackDemo />
      <hr className="my-8" />
      <UseMemoDemo />
    </LearnSection>
  )
}

// --------------------------------------------------------------------------
// 사용자 정의 useCallback 훅
// function useCallback(callback: () => void, deps: DependencyList) {
//   return useMemo(() => callback, deps)
// }

interface Props {
  children: ReactNode
  onChangeTheme: () => void
}

// 컴포넌트 렌더링 성능 최적화
// - React.useMemo
// - React.useCallback
// - React.memo

function ThemeChangeButton({ children, onChangeTheme }: Props) {
  usePrev(children)
  usePrev(onChangeTheme)

  return (
    <button
      type="button"
      className="cursor-pointer bg-blue-700 text-white p-2 rounded fixed right-3 top-3 z-50 text-xs"
      onClick={onChangeTheme}
    >
      {children}
    </button>
  )
}

// --------------------------------------------------------------------------
// useCallback 데모
function UseCallbackDemo() {
  const [divideValue, setDivideValue] = useState(1)

  const filteredHighCostList = useMemo(() => {
    return highCostList.filter(({ key }) => key % divideValue === 0)
  }, [divideValue])

  const [isDark, setIsDark] = useState(true)
  const handleChangeDarkTheme = useCallback(
    () => setIsDark((d) => !d),
    [setIsDark]
  )

  const theme = useMemo(
    () =>
      isDark
        ? {
            backgroundColor: '#000',
            color: '#fff',
          }
        : {
            backgroundColor: '#fff',
            color: '#000',
          },
    [isDark]
  )

  // 컴포넌트 몸체(body) 내부에 정의된 함수
  // 정의된 함수는 isDark 상태 값이 변경될 때 말고는 다시 계산될 필요가 없다.
  // const printDarkModeState = useMemo(() => 함수값, [])
  // const printDarkModeState = useMemo(
  //   function () {
  //     return function () {
  //       console.time('고비용 계산')
  //       for (let i = 0; i < 3e8; i++) {}
  //       console.timeEnd('고비용 계산')
  //       console.log({ isDark })
  //     }
  //   },
  //   [isDark]
  // )
  // useMemo 훅을 사용해 함수 값을 반환했더니 코드가 장황하다.
  // const printDarkModeState = useMemo(
  //   () => () => {
  //     console.time('고비용 계산')
  //     for (let i = 0; i < 3e8; i++) {}
  //     console.timeEnd('고비용 계산')
  //     console.log({ isDark })
  //   },
  //   [isDark]
  // )
  // 장황한 코드를 보다 간결하게 작성할 수 있도록 제공하는 훅이 있다.
  // 그 훅의 이름은 useCallback이다. (내부적으로 useMemo 사용하는 훅)
  const printDarkModeState = useCallback(() => {
    // console.time('고비용 계산')
    for (let i = 0; i < 3e8; ++i) {}
    // console.timeEnd('고비용 계산')
    // console.log({ isDark })
  }, [])

  useEffect(() => {
    // 이펙트의 종속성(의존성) 데이터인
    // 함수 값이 변경될 때만 이펙트 함수 콜백
    // console.log('이펙트 함수 실행')
    printDarkModeState()
  }, [printDarkModeState])

  return (
    <>
      <ThemeChangeButton
        onChangeTheme={handleChangeDarkTheme}
        // onChangeTheme={() => setIsDark((d) => !d)}
      >
        {`테마 스위치 ${divideValue}`}
      </ThemeChangeButton>

      <div className="p-5" style={theme}>
        <h2 className="text-xl font-semibold mb-6">메모이제이션 훅</h2>

        <div role="group">
          <label htmlFor="divide-value">나머지 수</label>
          <input
            type="number"
            id="divide-value"
            className="border p-2 w-[3rem]"
            value={divideValue}
            onChange={(e) => setDivideValue(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <output>
            리스트 총 갯수: {highCostList.length.toLocaleString()}
          </output>
          <output>
            필터링된 리스트의 갯수:{' '}
            {filteredHighCostList.length.toLocaleString()}
          </output>
        </div>
      </div>
    </>
  )
}

// --------------------------------------------------------------------------
// useMemo 데모

const highCostList = Array(1e7)
  .fill(null)
  .map((_, i) => ({ key: i + 1 }))

function UseMemoDemo() {
  const [divideValue, setDivideValue] = useState<number>(1)
  usePrev(divideValue)

  console.time('리스트 필터링')
  // const filteredHighCostList = useMemo(() => 계산된 값, [종속성(반응성데이터)]) // 값을 메모(기억)
  const filteredHighCostList = useMemo(() => {
    console.log('계산된 값 메모화')
    return highCostList.filter(({ key }) => key % divideValue === 0)
  }, [divideValue])
  console.timeEnd('리스트 필터링')

  const [isDark, setIsDark] = useState(true)

  // 비용이 많이드는 연산은 아니지만,
  // 다시 렌더링될 때, 기억된 값을 사용하도록 useMemo로 캐싱해보세요.
  // "useMemo 훅은 계산된 값을 기억한다."
  // 첫 번째 인수로 값을 계산하는 함수를 전달받는다.
  // 두 번째 인수로 다시 계산을 하도록 하는 반응성 데이터를 설정한다.
  // useMemo(() => 계산된 값, [반응성데이터1, 반응성데이터2])
  const memoizedTheme = useMemo(() => {
    console.log('테마 변경')
    return isDark
      ? {
          backgroundColor: '#000',
          color: '#fff',
        }
      : {
          backgroundColor: '#fff',
          color: '#000',
        }
  }, [isDark])

  const theme = isDark
    ? {
        backgroundColor: '#000',
        color: '#fff',
      }
    : {
        backgroundColor: '#fff',
        color: '#000',
      }

  // 기본 타입이 메모되었는 지 검증
  useEffect(() => {
    console.log(
      `%ctheme.color = ${theme.color}`,
      'color: maroon; font-weight: 900'
    )
  }, [theme.color])

  // 객체 타입이 메모되었는 지 검증
  useEffect(() => {
    console.log('%ctheme 변경', 'color: #070787; font-weight: 900')
  }, [theme])

  useEffect(() => {
    console.log('memoizedTheme 변경')
  }, [memoizedTheme])

  return (
    <>
      <button
        type="button"
        className="cursor-pointer bg-blue-700 text-white p-2 rounded fixed right-3 top-3 z-50 text-xs"
        onClick={() => setIsDark((d) => !d)}
      >
        테마 스위치
      </button>

      <div className="p-5" style={memoizedTheme}>
        <h2 className="text-xl font-semibold mb-6">메모이제이션 훅</h2>

        <div role="group">
          <label htmlFor="divide-value">나머지 수</label>
          <input
            type="number"
            id="divide-value"
            className="border p-2 w-[3rem]"
            value={divideValue}
            onChange={(e) => setDivideValue(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <output>
            리스트 총 갯수: {highCostList.length.toLocaleString()}
          </output>
          <output>
            필터링된 리스트의 갯수:{' '}
            {filteredHighCostList.length.toLocaleString()}
          </output>
        </div>
      </div>
    </>
  )
}
