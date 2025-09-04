// 여러 함수를 순서대로 적용하는 유틸리티
export default function compose(...fns) {
  return (x) => fns.reduce((acc, fn) => fn(acc), x)
}
