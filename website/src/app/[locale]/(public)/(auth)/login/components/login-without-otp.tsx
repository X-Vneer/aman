"use client"

import phoneNumberSchema from "@/validation/phone-number"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input, Spinner } from "@heroui/react"
import { signIn } from "next-auth/react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import ar from "react-phone-number-input/locale/ar.json"
import en from "react-phone-number-input/locale/en.json"
import PhoneInput from "react-phone-number-input/react-hook-form"
import "react-phone-number-input/style.css"
import { z } from "zod"

import Button from "@/components/ui/button"
import { Ripple } from "m3-ripple"

import { useRouter } from "@/lib/i18n/navigation"
import { ErrorResponse } from "@/types"
import axios from "axios"
import { useParams, useSearchParams } from "next/navigation"
import { useState } from "react"

type Props = {}

const LoginWithoutOtp = (props: Props) => {
  const t = useTranslations("login.send-opt")
  const continueButtonText = useTranslations("rating")("continue")
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const courseId = searchParams.get("courseId")

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

  const Router = useRouter()
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const phonenumber = data.mobile?.replace("+", "")
      const loginResponse = await signIn("credentials", { mobile: phonenumber, redirect: false })
      if (loginResponse?.error) {
        form.setError("root", { message: "unauthorized" })
        return
      }

      // If courseId exists, redirect to the course page (backend auto-enrolls and plays it)
      // Otherwise, use callbackUrl or default to /start
      if (courseId) {
        Router.push(`/course/${courseId}`)
      } else {
        Router.push(callbackUrl || "/start")
      }
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
        <p className="text-default-500 text-sm">{t("description")}</p>
      </div>

      <div dir="ltr">
        <p className="mb-2 text-white">{t("input-label")}</p>
        <PhoneInput
          control={form.control}
          name="mobile"
          labels={locale === "ar" ? ar : en}
          international
          countryCallingCodeEditable={false}
          defaultCountry="PS"
          inputComponent={Input}
          placeholder="+970"
          size="lg"
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
          <Ripple />
          {continueButtonText}
        </Button>
        {form.formState.errors.root ? (
          <p className="text-danger mt-3 text-sm font-semibold">{t("errors.serverError")}</p>
        ) : (
          ""
        )}
      </div>
    </form>
  )
}

export default LoginWithoutOtp
