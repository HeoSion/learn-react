import { type ChangeEvent, useCallback, useEffect, useState } from 'react'

export default function useInput(initialValue: string | number) {
  const [value, setValue] = useState(String(initialValue))
  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }, [])

  useEffect(() => {
    setValue(String(initialValue))
  }, [initialValue])

  return { value, onChange }
}
