const cache = {
  0: 0,
  1: 1,
}

// 메모이제이션(Memoization) 패턴
function fibonacci(n, { debug = false } = {}) {
  // 캐시된 값 확인 후,
  // 캐시된 값이 있다면 값 반환 (빠른 종료)
  const cachedValue = cache[n]
  if (typeof cachedValue === 'number') {
    debug && console.table(cache)
    return cachedValue
  }

  if (n === 0) return 0
  if (n === 1) return 1
  const calculatedValue = fibonacci(n - 1) + fibonacci(n - 2)

  // 계산된 값 캐시(cache)
  cache[n] = calculatedValue

  return calculatedValue
}

export default fibonacci
