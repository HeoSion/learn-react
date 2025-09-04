import { useCallback } from 'react'
import { useImmer } from 'use-immer'
import type { State } from '@/@types/global'

export default function useMutation<A, R>({
  mutateFn,
}: {
  mutateFn: (arg: A) => Promise<Response>
}) {
  const [state, setState] = useImmer<State<R>>({
    status: 'idle',
    error: null,
    data: null,
  })

  const isLoading = state.status === 'pending'
  const hasError = state.status === 'rejected'
  const isSuccess = state.status === 'resolved'

  const mutate = useCallback(
    async (arg: A) => {
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
      } catch (error) {
        setState((draft) => {
          draft.status = 'rejected'
          draft.error = new Error(error as string)
        })
      }
    },
    [mutateFn, setState]
  )

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      error: null,
      data: null,
    })
  }, [setState])

  return { ...state, isLoading, hasError, isSuccess, mutate, reset }
}
