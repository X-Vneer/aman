import { useState, useCallback } from "react"

interface UseMutationOptions<TData, TError, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: TError) => void
  onMutate?: (variables: TVariables) => void
}

interface UseMutationResult<TData, TError, TVariables> {
  mutate: (variables: TVariables) => Promise<void>
  data: TData | null
  error: TError | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

function useMutation<TData, TError, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TError, TVariables>,
): UseMutationResult<TData, TError, TVariables> {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<TError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true)
      setIsSuccess(false)
      setError(null)

      try {
        options?.onMutate?.(variables)
        const result = await mutationFn(variables)
        setData(result)
        setIsSuccess(true)
        options?.onSuccess?.(result, variables)
      } catch (err) {
        setError(err as TError)
        options?.onError?.(err as TError)
      } finally {
        setIsLoading(false)
      }
    },
    [mutationFn, options],
  )

  return {
    mutate,
    data,
    error,
    isLoading,
    isSuccess,
    isError: !!error,
  }
}

export default useMutation
