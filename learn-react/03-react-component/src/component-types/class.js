// 클래스 리액트 컴포넌트
// 클래스가 리액트 엘리먼트를 렌더링

// class 구문(syntax)
// class 클래스이름 {}

// 리액트의 컴포넌트 클래스를 작성하려면?
// 리액트.컴포넌트 클래스(super)를 확장한 서브 클래스 생성
class AppButton extends React.Component {
  // 생성자(constructor) 함수
  // constructor(props) {
  //   super(props)
  //   // 이 안에서 무언가를 하지 않으면 생략 가능
  //   // 컴포넌트 상태(로컬 데이터)
  //   // this.state = {}
  // }

  // 렌더 메서드
  render() {
    // 객체 구조 분해 할당
    const { type, className, disabled, children } = this.props

    // 리액트 엘리먼트 반환
    return React.createElement('button', {
      type: type,
      className: className,
      disabled: disabled
    }, children)
  }
}
// console.log(AppButton)

// 리액트에서는 이렇게 사용하면 안됨 ❌
// JavaScript에서 클래스로부터 인스턴스를 생성하려면?
// const appButton = new AppButton()
// console.log(appButton)

// 리액트에서는 이렇게 사용해야 함 ✅
// 리액트의 방식으로 컴포넌트로부터 엘리먼트 생성
const disabledSubmitButton = React.createElement(
  AppButton, 
  { disabled: true, type: 'submit', className: 'submit-button' },
  '폼 제출'
)

// console.log(disabledSubmitButton)

const enabledNormalButton = React.createElement(
  AppButton, 
  { disabled: false, type: 'button', className: 'normal-button' },
  '표시/감춤'
)

// console.log(enabledNormalButton)

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return React.createElement(
      'div',
      { className: 'app' },
      disabledSubmitButton,
      enabledNormalButton
    )
  }
}

// ReactDOM을 사용해 실제 DOM에 렌더링
ReactDOM.createRoot(document.getElementById('container')).render(
  React.createElement(App)
)
