export default function Output(props) {
  const classNames = `output ${props.isAnimate ? 'is-animate' : ''}`
  return <output className={classNames.trim()}>{props.children}</output>
}
