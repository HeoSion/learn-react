import { type ComponentProps, useEffect, useRef } from 'react'

type Props = ComponentProps<'input'> & {
  label: string
  shouldFocus?: boolean
  containerProps?: ComponentProps<'div'>
  labelProps?: ComponentProps<'label'>
}

export default function AutoFocusInput({
  label,
  shouldFocus = true,
  containerProps,
  labelProps,
  ...restProps
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus()
    }
  }, [shouldFocus])

  return (
    <div {...containerProps}>
      <label htmlFor="nameInput" {...labelProps}>
        {label}
      </label>
      <input
        type="text"
        ref={inputRef}
        id="nameInput"
        placeholder="자동 초점"
        {...restProps}
      />
    </div>
  )
}
