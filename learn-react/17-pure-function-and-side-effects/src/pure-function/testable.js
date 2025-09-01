// 동일 입력, 동일 출력인 함수
const add = (a, b) => Number(a) + Number(b)

// 테스트 코드 예시 (예측된 결과대로 코드가 실행되었음을 보장)
console.assert(add(2, 3) === 5, 'add(2, 3)는 5여야 합니다.')
console.assert(add(2, 3) === 5, 'add(2, 3)는 항상 5여야 합니다.')
console.assert(add(0, 0) === 0, 'add(0, 0)은 0이어야 합니다.')
console.assert(add('0', '0') === 0, "add('0', '0')은 0이어야 합니다.")
