import { useState } from 'react'
import emotions from '@/data/emotions.json'
import { getRandom } from '@/utils'
import LearnSection from '../learn-section'
import ChangeButton from './change-button'
import { EmotionFigure } from './emotions'

const getRandomIndex = () => getRandom(emotions.length)

export default function SharingState() {
  const [randomIndex, setRandomIndex] = useState(getRandomIndex)
  const emotionInfo = emotions[randomIndex]

  const handleChangeRandomIndex = () => setRandomIndex(getRandomIndex())

  return (
    <LearnSection title="다른 컴포넌트와 상태 공유하기">
      <EmotionFigure info={emotionInfo} />
      <ChangeButton
        message={emotionInfo.message}
        onUpdate={handleChangeRandomIndex}
      />
    </LearnSection>
  )
}
