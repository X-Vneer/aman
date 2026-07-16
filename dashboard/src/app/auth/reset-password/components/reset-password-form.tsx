import { useNavigate } from "@/lib/i18n/navigation"
import { AmanApiGuest } from "@/services/aman"
import { handleFormError } from "@/utils/handle-form-errors"
import { showErrorMessage } from "@/utils/show-error-message"
import { ResetPasswordSchema } from "@/validation/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, PasswordInput, PinInput, Stack, Text } from "@mantine/core"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

const ResetForm = () => {
  const { t } = useTranslation()
  const form = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      otp: "",
      password: "",
      password_confirmation: "",
    },
  })
  const { control, formState } = form
  const { errors } = formState
  const searchParams = useOptimisticSearchParams()
  const email = searchParams.get("email")

  const navigate = useNavigate()
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      console.log("🚀 ~ onSubmit ~ data:", data)
      const response = await AmanApiGuest.put("/password/update", {
        email,
        otp: data.otp,
        password: data.password,
      })
      console.log("🚀 ~ onSubmit ~ response:", response)
      navigate(`/auth/login`)
    } catch (error) {
      handleFormError(error, form)
    }
  })

  return (
    <Stack component={"form"} onSubmit={onSubmit} gap={"lg"}>
      <Controller
        control={control}
        name="otp"
        render={({ field }) => {
          return (
            <Stack>
              <Text>{t("reset-password.form.otp-label")}</Text>
              <div className="w-fit">
                <PinInput
                  type="number"
                  oneTimeCode
                  size="lg"
                  {...field}
                  error={!!showErrorMessage(errors, "otp")}
                />
              </div>
            </Stack>
          )
        }}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => {
          return (
            <PasswordInput
              size="lg"
              label={t("reset-password.form.password-label")}
              {...field}
              error={showErrorMessage(errors, "password")}
            />
          )
        }}
      />
      <Controller
        control={control}
        name="password_confirmation"
        render={({ field }) => {
          return (
            <PasswordInput
              size="lg"
              label={t("reset-password.form.password-confirmation-label")}
              {...field}
              error={showErrorMessage(errors, "password_confirmation")}
            />
          )
        }}
      />

      <Button type="submit" loading={form.formState.isSubmitting} size="lg" color="primary">
        {t("reset-password.form.save-button")}
      </Button>
      {errors.root ? <p className="text-sm font-medium text-red-500">{errors.root.message}</p> : null}
    </Stack>
  )
}

export default ResetForm
