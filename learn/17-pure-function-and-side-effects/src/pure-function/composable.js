// 두 가지 규칙을 지킨 함수들 (순수 함수)
// 1. 부수 효과를 포함하지 말 것
import compose from './compose'

// 2. 동일 입력 -> 동일 출력외 되도록 구성할 것
const double = (x) => x * 2
const square = (x) => x * x

// 함수를 조합해서 새로운 기능 만들기
// const doubleThenSquare = (x) => square(double(x))

// 컴포즈 유틸리티를 활용해 함수 조합하기
const doubleThenSquare = compose(double, square)

// 순수 함수인 지 여부를 확인하는 방법
// - 동일 입력 조건으로 함수를 두 번 이상 실행해본다.
// - 결과가 같다면 함수는 순수하다.

console.log(doubleThenSquare(3)) // 36 (3을 두 배로 → 6, 그걸 제곱 → 36)
console.log(doubleThenSquare(3)) // 동일 입력 -> 동일 출력
