"use client"

import axios from "axios"
import { useTranslations } from "next-intl"
import { parseAsInteger, parseAsString, useQueryState, useQueryStates } from "nuqs"
import React, { useState } from "react"

import CountDown from "@/components/common/count-down"
import Button from "@/components/ui/button"
import AmanApi from "@/services/aman"
import PostSendOTP from "@/services/utils/post-send-opt"
import { InputOTP } from "@heroui/react"
import { useUser } from "../../context/user-context"

type Props = {}

const VerifyOTP = (props: Props) => {
  const t = useTranslations("profile.update-mobile.verify-opt")

  // user
  const [user] = useUser()
  // state
  const [{ mobile, tries, date }, setQueries] = useQueryStates({
    mobile: parseAsString,
    tries: parseAsInteger.withDefault(0),
    date: parseAsInteger,
  })
  const [_, setSuccess] = useQueryState("success")

  // handle change mobile
  const handleChangeMobileNumber = () => {
    setQueries({
      mobile: null,
      tries: 0,
      date: null,
    })
  }

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [otp, setOtp] = useState("")

  const handleVerifyTOP: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    try {
      setQueries(
        (pre) => {
          return {
            tries: ++pre.tries,
          }
        },
        { shallow: true },
      )
      if (tries > 3) {
        setError(t(`errors.overuse`))
        return
      }
      setIsLoading(true)

      const phonenumber = mobile?.replace("+", "")

      const response = await AmanApi.put(`user/mobile/update`, {
        old_mobile: user.mobile,
        new_mobile: phonenumber,
        otp: otp,
      })
      setSuccess("true")
    } catch (error) {
      console.log("🚀 ~ handleVerifyTOP ~ error:", error)
      setError(t(`errors.serverError`))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      const response = await PostSendOTP({ mobile: mobile! })
      setQueries(
        {
          date: Date.now(),
          tries: 0,
        },
        {
          shallow: true,
        },
      )
      console.log("🚀 ~ handleResendCode ~ response:", response)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        setError(t(`errors.tryAgainAfter`))
      }
      setError(t("errors.serverError"))
    }
  }
  return (
    <form onSubmit={handleVerifyTOP} className="flex flex-col gap-20">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{t("title")}</h2>
        <p className="text-sm text-default-500">{t("description")}</p>
      </div>
      <div>
        <p className="mb-4 text-center text-xl">{t("input-label")}</p>

        <div dir="ltr" className="flex justify-center">
          <InputOTP maxLength={4} value={otp} onChange={setOtp}>
            <InputOTP.Group>
              <InputOTP.Slot index={0} />
              <InputOTP.Slot index={1} />
              <InputOTP.Slot index={2} />
              <InputOTP.Slot index={3} />
            </InputOTP.Group>
          </InputOTP>
        </div>
        {error ? <p className="mt-3 text-sm font-semibold text-danger">{error}</p> : ""}

        <div className="mt-10">
          <CountDown
            key={date}
            date={(date ? date : Date.now()) + 60000}
            result={
              <p className="cursor-pointer text-secondary underline" onClick={handleResendCode}>
                {t("resend-code")}
              </p>
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Button isLoading={isLoading} type="submit">
          {t("button")}
        </Button>

        <Button
          onClick={handleChangeMobileNumber}
          variant="tertiary"
          className="text-default-500 underline">
          {t("change-number-button")}
        </Button>
      </div>
    </form>
  )
}

export default VerifyOTP
