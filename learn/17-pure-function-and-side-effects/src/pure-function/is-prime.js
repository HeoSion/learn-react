const cache = {
  1: false,
}

const isPrime = (n, { isDebug = false } = {}) => {
  const cachedPrime = cache[n]
  if (typeof cachedPrime === 'boolean') {
    isDebug && console.log({ cache })
    return !isDebug ? cachedPrime : `캐시된 값: ${cachedPrime}`
  }

  for (let i = 2, sn = Math.sqrt(n); i <= sn; i++) {
    if (n % i === 0) {
      cache[n] = false
      return false
    }
  }

  cache[n] = true
  return true
}

export default isPrime
