"use client"
import Button from "@/components/ui/button"
import { cn } from "@/lib/cn"
import { useRouter } from "@/lib/i18n/navigation"
import AmanApi from "@/services/aman"
import { ErrorResponse, SuccessResponse } from "@/types"
import { User } from "@/types/login"
import { couponFormSchema } from "@/validation/coupon-form-schema"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, FieldError, Input, Label, Radio, RadioGroup, TextField } from "@heroui/react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

const CouponForm = () => {
  const session = useSession()
  const user = session.data?.user
  const t = useTranslations("complete-profile")
  const form = useForm({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      gender: "Male",
      age: "",
      nationality: "",
      sector: "",
      workplace: "",
    },
  })

  const Router = useRouter()
  const { course_id } = useParams() as { course_id: string }

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await AmanApi.put<SuccessResponse<User>>(`/user/update-form`, data)

      Router.push(`/certificate/${course_id}/view`)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const responseError = error.response.data as ErrorResponse<z.infer<typeof couponFormSchema>>
        form.setError("root", { message: responseError.message })
        if (responseError.errors) {
          for (let key in responseError.errors) {
            form.setError(key as keyof typeof responseError.errors, {
              message: responseError.errors![key as keyof typeof responseError.errors]![0],
            })
          }
        }

        return
      }

      form.setError("root", { message: t("errors.serverError") })
    }
  })

  return (
    <Card className="w-full max-w-sm border-none bg-[#0A090959] p-0! backdrop-blur-md">
      <Card.Content className="p-4 md:p-6 lg:p-8 rtl:text-right">
        <form onSubmit={onSubmit}>
          <div className="mb-3 space-y-1 rounded-t-lg">
            <h1 className="text-xl lg:text-2xl">{t("coupon-form-title")}</h1>
            <p className="text-default-500 text-sm">{t("coupon-form-description")}</p>
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Controller
              control={form.control}
              name="gender"
              render={({ field }) => (
                <RadioGroup
                  ref={field.ref}
                  name={field.name}
                  className="flex flex-col gap-2"
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  isInvalid={!!form.formState.errors.gender?.message}>
                  <Label className="text-default-500! text-xs">{t("gender")}</Label>
                  <div className="flex gap-2">
                    <Radio
                      value="Male"
                      className={cn(
                        "bg-content2 hover:bg-content3 m-0 inline-flex w-full max-w-[300px] flex-1 cursor-pointer items-center justify-center gap-4 rounded-lg border-2 border-transparent p-3 text-center",
                        "data-[selected=true]:border-primary",
                      )}>
                      <Radio.Control className="sr-only">
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content>
                        <span className="text-sm">{t("male")}</span>
                      </Radio.Content>
                    </Radio>
                    <Radio
                      value="Female"
                      className={cn(
                        "bg-content2 hover:bg-content3 m-0 inline-flex w-full max-w-[300px] flex-1 cursor-pointer items-center justify-center gap-4 rounded-lg border-2 border-transparent p-3 text-center",
                        "data-[selected=true]:border-primary",
                      )}>
                      <Radio.Control className="sr-only">
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content>
                        <span className="text-sm">{t("female")}</span>
                      </Radio.Content>
                    </Radio>
                  </div>
                  {form.formState.errors.gender?.message ? (
                    <FieldError>
                      {t(`errors.${form.formState.errors.gender?.message as "required"}`)}
                    </FieldError>
                  ) : null}
                </RadioGroup>
              )}
            />

            <Controller
              control={form.control}
              name="age"
              render={({ field }) => (
                <TextField fullWidth isInvalid={!!form.formState.errors.age?.message} className="w-full">
                  <Label className="text-default-500! text-xs">{t("age")}</Label>
                  <Input
                    type="number"
                    min={0}
                    className="w-full rounded"
                    placeholder={t("last_name-input-placeholder")}
                    {...field}
                  />
                  {form.formState.errors.age?.message ? (
                    <FieldError>{t(`errors.${form.formState.errors.age?.message as "required"}`)}</FieldError>
                  ) : null}
                </TextField>
              )}
            />

            <Controller
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <TextField
                  fullWidth
                  isInvalid={!!form.formState.errors.nationality?.message}
                  className="w-full">
                  <Label className="text-default-500! text-xs">{t("nationality")}</Label>
                  <Input
                    className="w-full rounded"
                    placeholder={t("last_name-input-placeholder")}
                    {...field}
                  />
                  {form.formState.errors.nationality?.message ? (
                    <FieldError>
                      {t(`errors.${form.formState.errors.nationality?.message as "required"}`)}
                    </FieldError>
                  ) : null}
                </TextField>
              )}
            />
            <Controller
              control={form.control}
              name="sector"
              render={({ field }) => (
                <TextField fullWidth isInvalid={!!form.formState.errors.sector?.message} className="w-full">
                  <Label className="text-default-500! text-xs">{t("sector")}</Label>
                  <Input
                    className="w-full rounded"
                    placeholder={t("last_name-input-placeholder")}
                    {...field}
                  />
                  {form.formState.errors.sector?.message ? (
                    <FieldError>
                      {t(`errors.${form.formState.errors.sector?.message as "required"}`)}
                    </FieldError>
                  ) : null}
                </TextField>
              )}
            />
            <Controller
              control={form.control}
              name="workplace"
              render={({ field }) => (
                <TextField
                  fullWidth
                  isInvalid={!!form.formState.errors.workplace?.message}
                  className="w-full">
                  <Label className="text-default-500! text-xs">{t("workplace")}</Label>
                  <Input
                    className="w-full rounded"
                    placeholder={t("last_name-input-placeholder")}
                    {...field}
                  />
                  {form.formState.errors.workplace?.message ? (
                    <FieldError>
                      {t(`errors.${form.formState.errors.workplace?.message as "required"}`)}
                    </FieldError>
                  ) : null}
                </TextField>
              )}
            />
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4">
            <Button
              size="md"
              isLoading={form.formState.isSubmitting}
              type="submit"
              className="mx-auto max-w-sm">
              {t("save-button")}
            </Button>
          </div>
          <DevTool control={form.control} />
        </form>
      </Card.Content>
    </Card>
  )
}

export default CouponForm
