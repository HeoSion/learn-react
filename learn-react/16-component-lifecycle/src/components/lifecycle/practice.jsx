import { Component } from 'react'

const ChatAPI = {
  connect() {
    console.log('채팅 앱에 연결되었습니다.')
  },
  update(newHeadline) {
    console.log(`채팅 헤드라인 상태가 "${newHeadline}"로 변경되었습니다.`)
  },
  disconnect() {
    console.log('채팅 앱에서 연결이 해제되었습니다.')
  },
}

export default class PracticePart2 extends Component {
  state = {
    headline: 'Practice 컴포넌트',
  }

  static getDerivedStateFromProps(props) {
    if (props.email) {
      const [userId] = props.email.split('@')
      return { userId }
    }

    return null
  }

  shouldComponentUpdate(nextProps, _nextState) {
    // console.log('업데이트될 속성', { nextProps })
    // console.log('현재 속성', { currentProps: this.props })

    const tryRender = nextProps.email !== this.props.email
    console.log('렌더링을 할까요?', tryRender ? '네' : '아니오')
    return tryRender ? true : false

    // return true // 렌더링 ✅
    // return false // 렌더링 ❌
  }

  render() {
    console.log('Practice 렌더링')

    return (
      <section className="border-2 bg-indigo-600 text-white p-5 m-5">
        <h2>{this.state.headline}</h2>
        <button
          type="button"
          className="button mt-2"
          onClick={() =>
            this.setState({ headline: this.state.headline + '👏' })
          }
        >
          {this.state.userId} 👏
        </button>
      </section>
    )
  }

  componentDidMount() {
    console.log('Practice 마운트')
  }

  componentWillUnmount() {
    console.log('Practice 언마운트')
  }
}

/* -------------------------------------------------------------------------- */

class PracticePart1 extends Component {
  // constructor(props) {
  //   super(props)
  // }

  // 상태 선언
  state = {
    headline: 'Practice 컴포넌트',
  }

  // 컴포넌트 속성으로부터 파생된 상태 설정
  static getDerivedStateFromProps(props) {
    console.log('%cgetDerivedStateFromProps', 'font-weight: 900; color: blue')
    if (props.email) {
      const [userId] = props.email.split('@')
      // 파생된 상태 (객체 반환)
      return { userId }
    }

    // 파생된 상태 없음 (null 반환)
    return null
  }

  render() {
    console.log('컴포넌트 상태', this.state)

    // 렌더링 추적 : 컴포넌트가 리렌더링될 때마다 "렌더링" 출력
    console.log('Practice 렌더링')

    return (
      <section className="border-2 bg-indigo-600 text-white p-5 m-5">
        <h2>{this.state.headline}</h2>
        <button
          type="button"
          className="button mt-2"
          onClick={() =>
            this.setState({ headline: this.state.headline + '👏' })
          }
        >
          {this.state.userId} 👏
        </button>
      </section>
    )
  }

  // 클래스 필드에 메서드 정의 (인스턴스 메서드: 다른 메서드에서 접근 가능)
  handleClick = () => {
    console.log('문서 클릭')
  }

  intervalId = undefined // Node.js 런타임 타입 (undefined | number)

  // 마운트 감지 : 컴포넌트가 마운트될 때 "마운트" 출력
  componentDidMount() {
    // console.log(this) // Practice { state, props, handleClick, componentDidMount, componentDidUpdate, componentWillUnmount }

    console.log('Practice 마운트 됨')
    console.log('문서 클릭 이벤트 연결 또는 (채팅) 구독')
    document.addEventListener('click', this.handleClick)

    // 타이머 설정
    console.log('타이머 연결')
    this.intervalId = setInterval(() => {
      console.count('타이머')
    }, 1000)

    // 채팅 API 구독(연결)
    ChatAPI.connect()
  }

  // 상태 업데이트 감지 : 상태가 변경될 때마다 "변경된 상태 값" 출력
  componentDidUpdate(_, prevState) {
    console.log('변경되기 전 healdine 상태 값', prevState.headline)
    console.log('변경된 healdine 상태 값', this.state.headline)

    // 문서 제목 업데이트 : 상태가 변경될 때마다 문서의 제목 값을 동적으로 변경
    // 리액트가 할 수 없는 일을 여기에 작성
    document.title = this.state.headline

    // 채팅 API 상태 업데이트
    ChatAPI.update(this.state.headline)
  }

  // 라이프사이클 클린업 : 설정된 이벤트 리스닝 또는 타이머 등 정리(cleanup)
  componentWillUnmount() {
    // console.log(this) // Practice { state, props, handleClick, componentDidMount, componentDidUpdate, componentWillUnmount }

    console.log('연결 또는 (채팅) 구독된 모든 이벤트 리스너 클린업(정리)')
    document.removeEventListener('click', this.handleClick)

    // 타이머 설정 해제 (클린업)
    console.log('타이머 해제')
    clearInterval(this.intervalId)

    // 채팅 API 구독(연결) 해제 - 클린업(정리)
    ChatAPI.disconnect()
  }

  // 리액트 고급 사용자를 위한 클래스 컴포넌트의 라이프사이클 메서드
  // - static getDerivedStateFromProps(props, state) {}
  // - shouldComponentUpdate(nextProps, nextState) {}
  // - getSnapshotBeforeUpdate() {}
}
