import { UseFormReturnType } from "@mantine/form"
import axios from "axios"
export type ErrorResponse<T> = {
  message: string
  errors?: {
    [key in keyof T]?: string[]
  }
}

export const handleMantineFormError = <T>(error: unknown, form: UseFormReturnType<T, unknown>) => {
  if (axios.isAxiosError(error) && error.response?.status) {
    const responseError = error.response.data as ErrorResponse<{ "": "" }>

    form.setFieldError("root", responseError.message)

    if (responseError.errors) {
      for (const key in responseError.errors) {
        form.setFieldError(key, responseError.errors![key as keyof typeof responseError.errors]![0])
      }
    }

    return
  }
  form.setFieldError("root", "server error")
}
