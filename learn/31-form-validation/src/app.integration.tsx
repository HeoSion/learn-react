import {
  Controller,
  type FieldValues,
  type SubmitHandler,
  useForm,
} from 'react-hook-form'
import Select from 'react-select'

const countryOptions = [
  { value: 'kr', label: '대한민국' },
  { value: 'us', label: '미국' },
  { value: 'jp', label: '일본' },
]

export default function App() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          회원가입
        </h2>

        <div>
          <label
            htmlFor="email"
            className="block mb-1 font-medium text-gray-700"
          >
            이메일
          </label>
          <input
            type="email"
            id="email"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              errors.email ? 'border-red-400' : 'border-gray-300'
            }`}
            {...register('email', {
              required: '이메일을 입력해주세요.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '올바른 이메일 형식을 입력해주세요.',
              },
            })}
            aria-invalid={errors.email ? 'true' : 'false'}
            placeholder="이메일을 입력하세요"
          />
          {errors.email && (
            <span className="text-red-500 text-sm mt-1 block" role="alert">
              {errors?.email?.message as string}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-1 font-medium text-gray-700"
          >
            패스워드
          </label>
          <input
            type="password"
            id="password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${
              errors.password ? 'border-red-400' : 'border-gray-300'
            }`}
            {...register('password', {
              required: '패스워드를 입력해주세요.',
              minLength: {
                value: 6,
                message: '패스워드는 6자 이상이어야 합니다.',
              },
            })}
            aria-invalid={errors.password ? 'true' : 'false'}
            placeholder="패스워드를 입력하세요"
          />
          {errors.password && (
            <span className="text-red-500 text-sm mt-1 block" role="alert">
              {errors.password.message as string}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="country"
            className="block mb-1 font-medium text-gray-700"
          >
            국가
          </label>
          <Controller
            name="country"
            control={control}
            rules={{ required: '국가를 선택해주세요.' }}
            render={({ field }) => (
              <div className={errors.country ? 'border-red-400' : ''}>
                <Select
                  {...field}
                  options={countryOptions}
                  placeholder="국가를 선택하세요"
                  isClearable
                  id="country"
                  aria-invalid={errors.country ? 'true' : 'false'}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderColor: errors.country ? '#f87171' : '#d1d5db',
                      boxShadow: state.isFocused ? '0 0 0 2px #60a5fa' : '',
                      borderRadius: '0.5rem',
                      paddingLeft: '0.25rem',
                      minHeight: '2.5rem',
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: '#6b7280',
                      fontSize: '1rem',
                    }),
                  }}
                />
              </div>
            )}
          />
          {errors.country && (
            <span className="text-red-500 text-sm mt-1 block" role="alert">
              {errors.country.message as string}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow transition"
        >
          회원가입
        </button>
      </form>
    </div>
  )
}
