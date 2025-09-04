import type { ComponentProps } from 'react'
import { tw } from '@/utils'

type Props = ComponentProps<'section'> & { title: string; showTitle?: boolean }

export default function LearnSection(props: Props) {
  const { title, showTitle = false, children, ...restProps } = props

  return (
    <section className={tw('p-5')} {...restProps}>
      <h1
        className={tw('text-2xl text-inherit font-semibold mb-2', [
          showTitle || 'sr-only',
        ])}
      >
        {title}
      </h1>
      {children}
    </section>
  )
}
