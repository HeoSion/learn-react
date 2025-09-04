// <값 타입> (로컬 스토리지에 저장할 키, 값)
import { useCallback, useEffect, useState } from 'react'

const init = <Type>(storageKey: string, storageValue: Type) => {
  const value = globalThis.localStorage.getItem(storageKey)
  if (!value) return storageValue
  const parsedValue = JSON.parse(value)
  return parsedValue as Type
}

export default function usePersist<V>(storageKey: string, storageValue: V) {
  const [value, setValue] = useState<V>(init<V>(storageKey, storageValue))

  const remove = useCallback(() => {
    globalThis.localStorage.removeItem(storageKey)
    setValue('' as V)
  }, [storageKey])

  useEffect(() => {
    if (value) {
      globalThis.localStorage.setItem(storageKey, JSON.stringify(value))
    }
  }, [storageKey, value])

  return [value, setValue, { remove }] as const
}
