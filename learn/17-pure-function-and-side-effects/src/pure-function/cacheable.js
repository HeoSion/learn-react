// import isPrime from './is-prime'
import memoizedFibo from './fibonacci'

// 계산된 값을 기억하지 않는 함수
// const isPrime = (n) => {
//   if (n === 1) return false
//   for (let i = 2, sn = Math.sqrt(n); i <= sn; i++) {
//     if (n % i === 0) return false
//   }

//   return true
// }

// 캐시 사용 안함
// console.log(isPrime(19))
// console.log(isPrime(192))
// console.log(isPrime(1920))
// console.log(isPrime(19203))
// console.log(isPrime(19203, { isDebug: true }))

// --------------------------------------------------------------------------

// 계산된 값을 기억하지 않는 함수
// 피보나치 수열의 n항 값을 반환하는 함수
function fibonacci(n) {
  if (n === 0) return 0
  if (n === 1) return 1
  return fibonacci(n - 1) + fibonacci(n - 2)
}

// for (let i = 0, l = 10; i < l; i++) {
//   console.log(i, fibonacci(i))
// }

{
  const startTime = Date.now()
  console.log(fibonacci(40))
  const endTime = Date.now()
  console.log(`메모 없는 계산 시간 = ${endTime - startTime}ms`)
}

{
  const startTime = Date.now()
  console.log(memoizedFibo(40))
  const endTime = Date.now()
  console.log(`메모 있는 계산 시간 = ${endTime - startTime}ms`)
}
