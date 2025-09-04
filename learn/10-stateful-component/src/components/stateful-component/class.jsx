import { Component } from 'react'

export default class StatefulComponentClass extends Component {
  constructor(props) {
    super(props)

    // 컴포넌트 상태(로컬 데이터) 선언
    // 읽기/쓰기 모두 가능
    // 상태가 변경되면 리액트 리렌더링(다시 그림)
    this.state = {
      count: 9,
      name: '상태 설정이 가능한 클래스 컴포넌트',
    }

    // 명시적으로 메서드에 this 바인딩
    this.handleClick = this.handleClick.bind(this)
  }

  // this.state
  // state = {
  //   count: 9,
  //   name: '상태 설정이 가능한 클래스 컴포넌트',
  // }

  // 클래스 필드
  // 인스턴스 멤버
  name = 'StatefulComponentClass'

  // 컴포넌트 렌더링과 별개로 클래스 필드 내부에 데이터 값 기억하는 것이 가능
  prevCount = 0

  // 클래스 필드에 인스턴스 메서드 등록
  logUpdatedState = (stateKey) => {
    console.log(`업데이트된 ${stateKey} 상태 값 = `, this.state[stateKey])
  }

  // 클래스 컴포넌트로부터 인스턴스 생성 이후
  // 렌더링 될 때마다 render() 메서드가 실행됨
  render() {
    // 읽기 전용인 컴포너트 속성(외부에서 전달된 데이터)
    // console.log(this.props)
    const { className, style, ...restProps } = this.props

    const { name, count } = this.state

    const handleUpdateName = () => {
      // console.log(this)

      // 직접 상태 값 수정 ❌
      // 리액트가 업데이트 하지 않습니다.
      // this.state.name = '컴포넌트 상태가 업데이트 되었습니다!'

      // 허용된 방법을 사용해 상태 값 수정 ✅
      // this.setState(updater[,callback])
      // 리액트의 상태 업데이트는 비동기 (즉시 처리 안함, 나중에 처리함)
      this.setState(
        // {
        //   name: '컴포넌트 상태가 업데이트 되었습니다!',
        // },
        // updater
        (prevState) => ({
          name: prevState.name + '🦁',
        }),
        // callback
        this.logUpdatedState.bind(this, 'name')
      )

      console.log('handler = ', this.state.name) // '상태 설정이 가능한 클래스 컴포넌트'
    }

    const handleUpdateCount = () => {
      this.setState(
        {
          count: this.state.count + 1,
        },
        this.logUpdatedState.bind(this, 'name')
      )

      console.log('count 업데이트 전: ', this.state.count)
      this.prevCount = this.state.count
    }

    console.log('클래스 컴포넌트 렌더링')

    return (
      <article className={className} style={style} {...restProps}>
        <h2>상태가 있는 컴포넌트 (클래스 타입)</h2>

        <button type="button" onClick={this.handleClick}>
          메서드 클릭
        </button>
        <button type="button" onClick={this.handleClickListener}>
          클래스 필드 화살표 함수 클릭
        </button>

        <p>{name}</p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            marginBlockEnd: 20,
          }}
        >
          <output>이전 카운트 값: {this.prevCount}</output>
          <output>업데이트된 카운트 값: {count}</output>
        </div>
        <div role="group">
          <button type="button" onClick={handleUpdateName}>
            이름 수정
          </button>
          <button type="button" onClick={handleUpdateCount}>
            카운트 수정
          </button>
        </div>
      </article>
    )
  }

  // 이벤트 리스너로 사용할 인스턴스의 멤버
  // 인스턴스 멤버인 메서드(함수)가 언제 누구에 의해 실행되는가?
  handleClick() {
    console.log('click', 'instance method')
    console.log(this) // undefined
  }

  // 왜? 화살표 함수 표현식을 사용하면 this는 올바르게 인스턴스를 가리키는가?
  handleClickListener = () => {
    console.log('click listener', 'arrow function')
    console.log(this)
  }
}
