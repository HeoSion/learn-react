export default function ShortcutInfo() {
  return React.createElement(
    'p',
    { className: 'shortcut-info' },
    React.createElement('code', {}, 'Shift + Enter'),
    ' 키를 누르면 애니메이션이 다시 시작됩니다.'
  )
}
