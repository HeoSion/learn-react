import { useCallback } from 'react'
import { useImmer } from 'use-immer'

const INITIAL_STATE = {
  status: 'idle',
  error: null,
  data: null,
}

export default function useMutation({ mutateFn, onSuccess, onError }) {
  const [state, setState] = useImmer(INITIAL_STATE)

  const isLoading = state.status === 'pending'
  const hasError = state.status === 'rejected'
  const isSuccess = state.status === 'resolved'

  const mutate = useCallback(
    async (arg) => {
      // 서버에 데이터 뮤테이션 요청
      setState((draft) => {
        draft.status = 'pending'
        draft.error = null
      })

      try {
        const response = await mutateFn(arg)
        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(
            typeof responseData === 'string'
              ? responseData
              : JSON.stringify(responseData)
          )
        }

        setState((draft) => {
          draft.status = 'resolved'
          draft.data = responseData
        })

        onSuccess?.()
      } catch (error) {
        setState((draft) => {
          draft.status = 'rejected'
          draft.error = new Error(error)
        })
        onError?.()
      }
    },
    [mutateFn, setState]
  )

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
  }, [setState])

  return { ...state, isLoading, hasError, isSuccess, mutate, reset }
}
