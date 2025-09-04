import { type ComponentProps, type ReactNode, useId } from 'react'
import { type FieldValues, type SubmitHandler, useForm } from 'react-hook-form'
import { type ClassValue } from 'clsx'
import { Eye, EyeOff, HelpCircle } from 'lucide-react'
import { useToggleState } from './hooks'
import { tw } from './utils'

const validateEmail = (value: string) => {
  if (!value.endsWith('@likelion.dev'))
    return '메일 주소는 @likelion.dev로 끝나야 합니다.'
}

const validatePassword = (value: string) => {
  if (!/[a-z]/.test(value)) return '영문 소문자를 하나 이상 포함해야 합니다.'
  if (!/[A-Z]/.test(value)) return '영문 대문자를 하나 이상 포함해야 합니다.'
  if (!/[0-9]/.test(value)) return '숫자를 하나 이상 포함해야 합니다.'
  if (value.length < 8) return '8자리 이상 입력해야 합니다.'
}

export default function LoginForm() {
  const [showPassword, { toggle }] = useToggleState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm()

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    alert(JSON.stringify(data, null, 2))
    console.log(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={tw('flex flex-col gap-6 max-w-xl mx-auto p-6')}
      aria-label="로그인 폼"
      autoComplete="off"
      noValidate
    >
      <EmailInput
        error={errors.email?.message as string}
        inputProps={register('email', {
          required: { value: true, message: '이메일 입력은 필수입니다.' },
          validate: validateEmail,
        })}
      />
      <PasswordInput
        showPassword={showPassword}
        buttonProps={{ onClick: toggle }}
        error={errors.password?.message as string}
        inputProps={register('password', {
          required: { value: true, message: '패스워드 입력은 필수입니다.' },
          validate: validatePassword,
        })}
      />
      <SubmitButton />
    </form>
  )
}

/**
 * 이메일 입력 컴포넌트
 *
 * @example
 * // 에러 메시지가 없는 경우
 * <EmailInput />
 *
 * @example
 * // 에러 메시지가 있는 경우
 * <EmailInput error="이메일 형식이 올바르지 않습니다." />
 *
 * @example
 * // inputProps를 전달하여 input 속성 제어
 * <EmailInput inputProps={{ placeholder: '이메일을 입력하세요' }} />
 */
function EmailInput({
  error,
  inputProps,
  helpMessage,
}: {
  error?: string
  inputProps?: ComponentProps<'input'>
  helpMessage?: string
}) {
  const id = useId()
  const hasError = !!error
  const help = `필수 입력 (${helpMessage ?? '유효한 이메일 주소를 입력하세요.'})`

  return (
    <div role="group" className={tw('flex flex-col gap-2', error && 'error')}>
      <label
        htmlFor={id}
        className={tw(
          'flex items-center gap-1',
          'font-bold',
          '[.error_&]:text-red-600'
        )}
      >
        이메일{' '}
        <span aria-label={help} title={help}>
          <HelpCircle
            className={tw(
              'cursor-help text-slate-600 font-light',
              '[.error_&]:text-red-600'
            )}
            width={14}
            height={14}
          />
        </span>
      </label>
      <input
        id={id}
        type="email"
        name="email"
        aria-invalid={hasError}
        aria-describedby={`${id}-error`}
        autoComplete="off"
        className={tw(
          'px-2 py-1',
          'border border-slate-500 rounded',
          'outline-none focus:border-blue-500',
          '[.error_&]:border-red-500'
        )}
        {...inputProps}
      />
      <div
        role="alert"
        aria-live="polite"
        id={`${id}-error`}
        className={tw('text-sm', '[.error_&]:text-red-600')}
      >
        {error}
      </div>
    </div>
  )
}

/**
 * 패스워드 입력 컴포넌트
 *
 * @example
 * // 기본 사용법 (패스워드 감춤)
 * <PasswordInput />
 *
 * @example
 * // 패스워드 표시 상태로 렌더링
 * <PasswordInput showPassword={true} />
 *
 * @example
 * // 에러 메시지 표시
 * <PasswordInput error="비밀번호는 8자리 이상이어야 합니다." }} />
 *
 * @example
 * // inputProps, buttonProps를 활용한 커스텀
 * <PasswordInput
 *   inputProps={{ placeholder: '비밀번호 입력' }}
 *   buttonProps={{ onClick: () => alert('비밀번호 보기 전환!') }}
 * />
 */
function PasswordInput({
  error,
  inputProps,
  buttonProps,
  showPassword = false,
  helpMessage,
}: {
  error?: string
  inputProps?: ComponentProps<'input'>
  buttonProps?: ComponentProps<'button'>
  showPassword?: boolean
  helpMessage?: string
}) {
  const id = useId()
  const hasError = !!error
  const label = `패스워드 ${showPassword ? '감춤' : '표시'} 전환`
  const help = `필수 입력 (${helpMessage ?? '영문 대/소문자, 숫자 조합 8자리 이상 입력하세요.'})`

  return (
    <div role="group" className={tw('flex flex-col gap-2', error && 'error')}>
      <label
        htmlFor={id}
        className={tw(
          'flex items-center gap-1',
          'font-bold',
          '[.error_&]:text-red-600'
        )}
      >
        패스워드
        <span aria-label={help} title={help}>
          <HelpCircle
            className={tw(
              'cursor-help text-slate-600 font-light',
              '[.error_&]:text-red-600'
            )}
            width={14}
            height={14}
          />
        </span>
      </label>
      <div className="relative flex">
        <input
          id={id}
          name="password"
          type={showPassword ? 'text' : 'password'}
          aria-invalid={hasError}
          aria-describedby={`${id}-error`}
          autoComplete="off"
          className={tw(
            'flex-1',
            'px-2 py-1',
            'border border-slate-500 rounded',
            'outline-none focus:border-blue-500',
            '[.error_&]:border-red-500'
          )}
          {...inputProps}
        />
        <button
          type="button"
          aria-label={label}
          title={label}
          className={tw(
            'cursor-pointer',
            'absolute right-1 top-1/2 -translate-y-1/2',
            'p-1'
          )}
          {...buttonProps}
        >
          {showPassword ? (
            <Eye
              strokeWidth={1}
              width={20}
              height={20}
              className="[.error_&]:stroke-red-600"
            />
          ) : (
            <EyeOff
              strokeWidth={1}
              width={20}
              height={20}
              className="[.error_&]:stroke-red-600"
            />
          )}
        </button>
      </div>
      <div
        role="alert"
        aria-live="polite"
        id={`${id}-error`}
        className={tw('text-sm', '[.error_&]:text-red-600')}
      >
        {error}
      </div>
    </div>
  )
}

/**
 * 폼 제출 버튼 컴포넌트
 *
 * @example
 * // 기본 사용법
 * <SubmitButton>로그인</SubmitButton>
 *
 * @example
 * // 커스텀 텍스트와 스타일 적용
 * <SubmitButton className="bg-blue-500 text-white">회원가입</SubmitButton>
 *
 * @example
 * // disabled 상태
 * <SubmitButton disabled>제출 중...</SubmitButton>
 *
 * @example
 * // onClick 핸들러 추가
 * <SubmitButton onClick={() => alert('제출!')}>제출하기</SubmitButton>
 */
function SubmitButton({
  children,
  className,
  ...restProps
}: {
  children?: ReactNode
  className?: ClassValue
} & ComponentProps<'button'>) {
  return (
    <button
      type="submit"
      className={tw(
        'cursor-pointer',
        'border border-gray-400 rounded',
        'px-4 py-2',
        'bg-gray-100',
        'hover:bg-gray-200',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500',
        className
      )}
      {...restProps}
    >
      {children ?? '로그인'}
    </button>
  )
}
