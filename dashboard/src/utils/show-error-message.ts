import i18next from "i18next"
import { FieldErrors, FieldValues } from "react-hook-form"
import { resources } from "../lib/i18n"

export const showErrorMessage = <T extends FieldValues>(errors: FieldErrors<T>, key: keyof T) => {
  if (!errors[key]) return undefined
  return errors[key].type === "custom"
    ? errors[key].message?.toString()
    : i18next.t(
        `global.errors.${errors[key].message as keyof (typeof resources.ar.translation)["global"]["errors"]}`,
      )
}
