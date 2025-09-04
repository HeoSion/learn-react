import { tw } from '@/utils'

interface Props {
  count: number
  targetCount: number
}

export default function Output({ count, targetCount }: Props) {
  const isCompleted = count >= targetCount

  return (
    <output className={tw('output', isCompleted && 'is-animate')}>
      {count}
    </output>
  )
}
