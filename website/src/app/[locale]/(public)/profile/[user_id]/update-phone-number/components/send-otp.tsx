"use client"

import phoneNumberSchema from "@/validation/phone-number"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@heroui/react"
import { useTranslations } from "next-intl"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import { useForm } from "react-hook-form"
import ar from "react-phone-number-input/locale/ar.json"
import en from "react-phone-number-input/locale/en.json"
import PhoneInput from "react-phone-number-input/react-hook-form"
import "react-phone-number-input/style.css"
import { z } from "zod"

import Button from "@/components/ui/button"
import PostSendOTP from "@/services/utils/post-send-opt"
import { ErrorResponse } from "@/types"
import axios from "axios"
import { useParams } from "next/navigation"

type Props = {}

const SendOTP = (props: Props) => {
  const t = useTranslations("profile.update-mobile.send-opt")

  const form = useForm({
    resolver: zodResolver(
      z.object({
        mobile: phoneNumberSchema,
      }),
    ),
    defaultValues: {
      mobile: "",
    },
  })

  const [_, setQueries] = useQueryStates({ mobile: parseAsString.withDefault(""), date: parseAsInteger })
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await PostSendOTP(data)
      console.log("🚀 ~ onSubmit ~ response:", response)
      setQueries({ mobile: data.mobile, date: Date.now() })
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const responseError = error.response.data as ErrorResponse<{}>
        form.setError("root", { message: responseError.message })
        return
      }
      form.setError("root", { message: "serverError" })
    }
  })
  const { locale } = useParams() as { locale: string }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-20">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <p className="text-sm text-default-500">{t("description")}</p>
      </div>
      <div dir="ltr">
        <p className="mb-2 text-white">{t("input-label")}</p>
        <PhoneInput
          control={form.control}
          name="mobile"
          labels={locale === "ar" ? ar : en}
          international
          countryCallingCodeEditable={false}
          defaultCountry="SA"
          inputComponent={Input}
          placeholder="+966"
          size="lg"
          labelPlacement={"outside"}
          isInvalid={!!form.formState.errors.mobile?.message}
          errorMessage={
            form.formState.errors.mobile?.message
              ? t(`errors.${form.formState.errors.mobile?.message as "required"}`)
              : null
          }
        />
      </div>

      <div>
        <Button isLoading={form.formState.isSubmitting} type="submit">
          {t("button")}
        </Button>
        {form.formState.errors.root ? (
          <p className="mt-3 text-sm font-semibold text-danger">{t("errors.serverError")}</p>
        ) : (
          ""
        )}
      </div>
    </form>
  )
}

export default SendOTP
