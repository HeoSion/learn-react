import { Output, Logo, ShortcutInfo } from './components/index.js';
export default function App(props) {
  const isAnimate = props.count < props.targetCount ? true : false;
  return /*#__PURE__*/React.createElement("div", {
    className: "random-count-up"
  }, /*#__PURE__*/React.createElement(Logo, null), /*#__PURE__*/React.createElement(Output, {
    isAnimate: isAnimate
  }, props.count), /*#__PURE__*/React.createElement(ShortcutInfo, null));
}