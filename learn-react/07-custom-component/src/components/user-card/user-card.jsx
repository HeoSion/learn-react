import './user-card.css'

export default function UserCard(props) {
  return (
    <article className="user-card" aria-labelledby={props.id}>
      <h2 id={props.id} className="user-name">
        {props.name}
      </h2>
      <dl className="user-info">
        <div>
          <dt>나이</dt>
          <dd>{props.age}세</dd>
        </div>
        <div>
          <dt>전화번호</dt>
          <dd>{props.phoneNumber}</dd>
        </div>
        <div>
          <dt>주소</dt>
          <dd>{props.address}</dd>
        </div>
      </dl>
    </article>
  )
}
