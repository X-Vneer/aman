import { ErrorResponse } from "@/@types"
import i18n from "@/lib/i18n"
import axios from "axios"
import { FieldValues, Path, UseFormReturn } from "react-hook-form"

export const handleFormError = <T extends FieldValues>(error: unknown, form: UseFormReturn<T>) => {
  if (axios.isAxiosError(error) && error.response?.status) {
    const responseError = error.response.data as ErrorResponse<{ "": "" }>

    form.setError("root", { message: responseError.message })

    if (responseError.errors) {
      for (const key in responseError.errors) {
        form.setError(key as Path<T>, {
          message: responseError.errors![key as keyof typeof responseError.errors]![0],
          type: "custom",
        })
      }
    }

    return
  }
  form.setError("root", { message: i18n.t("global.errors.serverError") })
}
