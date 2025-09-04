import type { CSSProperties, ComponentProps, ReactNode } from 'react'
import { tw } from '@/utils'

type Props = ComponentProps<'section'> & {
  title: string
  showTitle?: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export default function LearnSection({
  title,
  showTitle = false,
  className,
  children,
  style,
  ...restProps
}: Props) {
  return (
    <section className={tw('p-5', className)} style={style} {...restProps}>
      <h1 className={tw('text-2xl font-semibold', [showTitle || 'sr-only'])}>
        {title}
      </h1>
      {children}
    </section>
  )
}
