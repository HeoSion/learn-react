import './emotion-face.css'

export default function EmotionFace({ face }) {
  return (
    <figure className="emotion-face">
      <img src={`/assets/emotions/${face}.jpg`} alt="" width={85} height={77} />
    </figure>
  )
}
