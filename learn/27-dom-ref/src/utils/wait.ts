/**
 * 지정된 지연 시간 후에 해결되는 Promise를 생성합니다.
 *
 * @example
 * // 기본값인 1초 동안 대기
 * await wait()
 *
 * @example
 * // 2초 동안 대기
 * await wait(2)
 */
export default function wait(delay: number = 1) {
  return new Promise((resolve) => setTimeout(resolve, delay * 1000))
}
