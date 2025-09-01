export default function ShortcutFunction() {
  const data = {
    className: 'shortcut-info',
    shortcutKey: 'Shift + Enter',
    message: ' 키를 누르면 애니메이션이 다시 시작됩니다.',
  }

  return React.createElement(
    'p',
    { className: data.className },
    React.createElement('code', {}, data.shortcutKey),
    data.message
  )
}

export class ShortcutClass extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      className: 'shortcut-info',
      shortcutKey: 'Shift + Enter',
      message: ' 키를 누르면 애니메이션이 다시 시작됩니다.',
    }
  }

  render() {
    const { className, shortcutKey, message } = this.state

    return React.createElement(
      'p',
      { className: className },
      React.createElement('code', {}, shortcutKey),
      message
    )
  }
}
