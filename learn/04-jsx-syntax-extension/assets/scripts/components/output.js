export default function Output(props) {
  const classNames = `output ${props.isAnimate ? 'is-animate' : ''}`;
  return /*#__PURE__*/React.createElement("output", {
    className: classNames.trim()
  }, props.children);
}