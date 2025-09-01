import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.js';
import { getRandomMinMax, getRandomHue, setDocumentTitle, setAppRandomHue } from './utils/index.js';
const MIN = 50;
const MAX = 99;
const ORIGIN_TITLE = document.title;
let count = 0;
let targetCount;
const container = document.getElementById('container');
if (!container) throw new Error('문서에 #container 요소가 존재하지 않습니다.');
const reactDOMRoot = ReactDOM.createRoot(container);
function render() {
  reactDOMRoot.render(/*#__PURE__*/React.createElement(App, {
    count: count,
    targetCount: targetCount
  }));
}
let animateId;
function animate() {
  count += 1;
  if (count > targetCount) {
    return cancelAnimationFrame(animateId);
  }
  render();
  animateId = requestAnimationFrame(animate);
}
function play() {
  setTargetCount();
  setDocumentTitle(ORIGIN_TITLE, targetCount);
  setAppRandomHue();
  animate();
}
function replay() {
  count = 0;
  play();
}
function setTargetCount() {
  targetCount = getRandomMinMax();
}
document.addEventListener('DOMContentLoaded', () => {
  play();
  document.body.addEventListener('click', replay);
  document.body.addEventListener('keydown', e => {
    if (e.shiftKey && e.code === 'Enter') replay();
  });
});