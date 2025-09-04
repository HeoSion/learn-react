// 외부 요인에 의존
let globalCount = 0

export function ImpureComponent1(props) {
  globalCount += 1 // 1

  return (
    <div className="impure-component" {...props}>
      카운트: {globalCount}
    </div>
  )
}

export function ImpureComponent2(props) {
  // 외부 환경(브라우저 로컬 스토리지 또는 서버의 데이터베이스 등)에서 값 읽기
  let localCount = localStorage.getItem('@impure-count')
  localCount = localCount ? JSON.parse(localCount) : 0

  return (
    <div className="impure-component" {...props}>
      카운트: {localCount}
    </div>
  )
}
