import EmotionFace from './emotion-face'
import StatusMessage from './status-message'

export default function EmotionFigure({ info }) {
  return (
    <>
      <EmotionFace face={info.key} />
      <StatusMessage>{info.message}</StatusMessage>
    </>
  )
}
