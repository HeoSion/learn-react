import { useCallback, useEffect, useState } from 'react'

export default function useToggleState(initialValue: boolean = true) {
  const [isToggle, setIsToggle] = useState<boolean>(initialValue)

  const on = useCallback(() => setIsToggle(true), [])
  const off = useCallback(() => setIsToggle(false), [])
  const toggle = useCallback(() => setIsToggle((t) => !t), [])

  useEffect(() => {
    setIsToggle(initialValue)
  }, [initialValue])

  return [isToggle, { on, off, toggle }] as const
}
