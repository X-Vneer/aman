"use client"
import { Card, Label, TextArea, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"

import Button from "@/components/ui/button"
import useMutation from "@/hooks/use-mutation"
import { ErrorResponse } from "@/types"
import axios from "axios"
import { useParams } from "next/navigation"
import { type ChangeEvent, useState } from "react"
import { PostRate } from "../rate"
import RatingHearts from "./rating-hearts"
import { useStep } from "./stepper"
export default function Rating() {
  // Enable static rendering
  const { course_id } = useParams() as { course_id: string }
  const t = useTranslations("rating")
  const [rates, setSelectedStars] = useState({
    rate_1: 0,
    rate_2: 0,
    rate_3: 0,
    rate_4: 0,
  })

  const { rate_1, rate_2, rate_3, rate_4 } = rates
  type keys = "rate_1" | "rate_2" | "rate_3" | "rate_4"
  const onRateChange = (key: keys, value: number) => {
    setSelectedStars((pre) => ({ ...pre, [key]: value }))
  }
  const [comment, setComment] = useState("")

  const [step, setStep] = useStep()
  const { mutate, isLoading, isError, error } = useMutation(PostRate, {
    onSuccess(data) {
      setStep(2)
    },
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({
      ...rates,
      comment,
      video_id: course_id,
    })
  }

  return (
    <>
      <Card className="mx-auto mb-20 w-full max-w-2xl shrink-0 rounded-xl bg-[#0A090959] p-1!">
        <div className="mb-3 space-y-1 rounded-t-lg bg-[#1D1B1B] px-5 py-5 md:px-7 md:py-7 lg:px-10 lg:py-9">
          <h1 className="text-xl lg:text-2xl">{t("title")}</h1>
          <p className="text-default-500 text-sm">{t("description")}</p>
        </div>
        <div>
          <form onSubmit={onSubmit} className="space-y-7 px-5 py-5 md:px-7 md:py-7 lg:px-10 lg:py-9">
            <div className="flex items-center justify-between gap-10">
              <p className="w-3/5 text-sm font-medium">{t("rating-list.1")}</p>
              <RatingHearts value={rate_1} onValueChange={(value) => onRateChange("rate_1", value)} />
            </div>
            <div className="flex items-center justify-between gap-10">
              <p className="w-3/5 text-sm font-medium">{t("rating-list.2")}</p>
              <RatingHearts value={rate_2} onValueChange={(value) => onRateChange("rate_2", value)} />
            </div>
            <div className="flex items-center justify-between gap-10">
              <p className="w-3/5 text-sm font-medium">{t("rating-list.3")}</p>
              <RatingHearts value={rate_3} onValueChange={(value) => onRateChange("rate_3", value)} />
            </div>
            <div className="flex items-center justify-between gap-10">
              <p className="w-3/5 text-sm font-medium">{t("rating-list.4")}</p>
              <RatingHearts value={rate_4} onValueChange={(value) => onRateChange("rate_4", value)} />
            </div>
            <TextField fullWidth className="w-full">
              <Label className="text-default-500! text-xs">{t("textarea-label")}</Label>
              <TextArea
                placeholder={t("textarea-placeholder")}
                value={comment}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              />
            </TextField>
            <div className="mx-auto max-w-md">
              <Button
                type="submit"
                isDisabled={!rate_1 || !rate_2 || !rate_3 || !rate_4}
                isLoading={isLoading}
                size="md">
                {t("continue")}
              </Button>
              {isError ? (
                <p className="text-danger-500 pt-2 text-center text-sm">
                  {axios.isAxiosError(error)
                    ? (error.response?.data as ErrorResponse<any>).message
                    : (error as any).message}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </Card>
    </>
  )
}
