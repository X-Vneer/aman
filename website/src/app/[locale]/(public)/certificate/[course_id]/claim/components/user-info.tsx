"use client"
import Button from "@/components/ui/button"
import { Link, useRouter } from "@/lib/i18n/navigation"
import AmanApi from "@/services/aman"
import { ErrorResponse, SuccessResponse } from "@/types"
import { User } from "@/types/login"
import { updateProfileSchema } from "@/validation/update-profile-schema"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, FieldError, Input, Label, TextField } from "@heroui/react"
import axios from "axios"
import { useSession } from "@/lib/auth/session-client"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { useVideo } from "../../context/video-context"

const UserInfo = () => {
  const video = useVideo()
  const session = useSession()
  const user = session.data?.user
  const t = useTranslations("complete-profile")
  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      email: video.user?.email || "",
      first_name: video.user?.first_name || "",
      last_name: video.user?.last_name || "",
    },
  })

  const Router = useRouter()

  const { course_id } = useParams() as { course_id: string }

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await AmanApi.put<SuccessResponse<User>>(`/user/users/${user!.id}`, data)
      Router.push(`/certificate/${course_id}/view`)
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        const responseError = error.response.data as ErrorResponse<z.infer<typeof updateProfileSchema>>
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
    <Card className="w-full max-w-md border-none bg-[#0A090959] p-0! backdrop-blur-md">
      {/* prefetching certificate page */}
      <Link href={`/certificate/${course_id}/view`} prefetch={true} className="sr-only" />
      <Card.Content className="p-4 md:p-6 lg:p-8 rtl:text-right">
        <form onSubmit={onSubmit}>
          <div className="mb-3 space-y-1 rounded-t-lg">
            <h1 className="text-xl lg:text-2xl">{t("title")}</h1>
            <p className="text-default-500 text-sm">{t("description")}</p>
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Controller
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <TextField
                  fullWidth
                  isInvalid={!!form.formState.errors.first_name?.message}
                  className="w-full">
                  <Label className="text-default-500 text-xs">{t("first_name")}</Label>
                  <Input
                    className="w-full rounded"
                    placeholder={t("first_name-input-placeholder")}
                    {...field}
                  />
                  {form.formState.errors.first_name?.message ? (
                    <FieldError>
                      {t(`errors.${form.formState.errors.first_name?.message as "required"}`)}
                    </FieldError>
                  ) : null}
                </TextField>
              )}
            />
            <Controller
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <TextField
                  fullWidth
                  isInvalid={!!form.formState.errors.last_name?.message}
                  className="w-full">
                  <Label className="text-default-500 text-xs">{t("last_name")}</Label>
                  <Input
                    className="w-full rounded"
                    placeholder={t("last_name-input-placeholder")}
                    {...field}
                  />
                  {form.formState.errors.last_name?.message ? (
                    <FieldError>
                      {t(`errors.${form.formState.errors.last_name?.message as "required"}`)}
                    </FieldError>
                  ) : null}
                </TextField>
              )}
            />
            <Controller
              control={form.control}
              name="email"
              render={({ field }) => (
                <TextField fullWidth isInvalid={!!form.formState.errors.email?.message} className="w-full">
                  <Label className="text-default-500 text-xs">{t("email")}</Label>
                  <Input
                    type="email"
                    className="w-full rounded"
                    placeholder={t("email-input-placeholder")}
                    {...field}
                  />
                  {form.formState.errors.email?.message ? (
                    <FieldError>
                      {t(`errors.${form.formState.errors.email?.message as "required"}`)}
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
            {form.formState.isSubmitSuccessful ? (
              <p className="text-success-500 text-sm font-semibold">{t("success")}</p>
            ) : (
              ""
            )}
          </div>
          <DevTool control={form.control} />
        </form>
      </Card.Content>
    </Card>
  )
}

export default UserInfo
