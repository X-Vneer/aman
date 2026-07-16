export type ErrorResponse<T> = {
  message: string
  errors?: {
    [key in keyof T]?: string[]
  }
}

export type SuccessResponse<T> = {
  status: true
  message: string
  data: {
    items: T
    item: T
  }
  guard: string
  errors: null
  response_code: number
}
