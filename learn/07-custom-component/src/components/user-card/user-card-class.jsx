import { Component } from 'react'
import './user-card.css'

// class 구문을 사용해 React 컴포넌트 구현
// 기능은 함수형 컴포넌트와 동일하게 구성
export default class UserCardClass extends Component {
  // 생략 가능
  // constructor(props) {
  //   super(props) // this.props
  // }

  // 렌더 메서드 실행 -> 리액트 엘리먼트 반환 -> 화면(view) 렌더링
  render() {
    // this.props 객체
    // 객체 구조 분해 할당
    const { id, name, age, address, phoneNumber } = this.props

    return (
      <article className="user-card" aria-labelledby={id}>
        <h2 id={id} className="user-name">
          {name}
        </h2>
        <dl className="user-info">
          <div>
            <dt>나이</dt>
            <dd>{age}세</dd>
          </div>
          <div>
            <dt>전화번호</dt>
            <dd>{phoneNumber}</dd>
          </div>
          <div>
            <dt>주소</dt>
            <dd>{address}</dd>
          </div>
        </dl>
      </article>
    )
  }
}
