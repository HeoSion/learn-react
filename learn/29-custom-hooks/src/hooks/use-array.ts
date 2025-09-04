import { useCallback, useEffect, useRef, useState } from 'react'

export default function useArray<Type>(initialValue: Type[] = []) {
  const [array, setArray] = useState(initialValue)
  const arrayRef = useRef(initialValue)

  const set = useCallback((nextArray: Type[]) => {
    setArray(nextArray)
  }, [])

  const push = useCallback((...items: Type[]) => {
    setArray((array) => [...array, ...items])
  }, [])

  const unshift = useCallback((...items: Type[]) => {
    setArray((array) => [...items, ...array])
  }, [])

  const replace = useCallback((index: number, item: Type) => {
    setArray((array) =>
      array.map((arrayItem, i) => (i === index ? item : arrayItem))
    )
  }, [])

  const filter = useCallback(
    (fn: (item: Type, index: number, array: Type[]) => boolean) => {
      setArray((array) => array.filter(fn))
    },
    []
  )

  const remove = useCallback((index: number) => {
    return setArray((array) => array.filter((_, i) => i !== index))
  }, [])

  const clear = useCallback(() => setArray([]), [])

  const reset = useCallback(() => setArray(initialValue), [initialValue])

  useEffect(() => {
    // 초깃값(initialValue) 변경 시, 참조 객체의 현재값 동기화
    arrayRef.current = initialValue
  }, [initialValue])

  return { array, set, push, unshift, replace, filter, remove, reset, clear }
}
