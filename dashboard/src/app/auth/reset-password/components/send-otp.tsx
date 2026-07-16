import { Link, useNavigate } from "@/lib/i18n/navigation"
import { AmanApiGuest } from "@/services/aman"
import { handleFormError } from "@/utils/handle-form-errors"
import { showErrorMessage } from "@/utils/show-error-message"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

const SendOTP = () => {
  const { t } = useTranslation()
  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.email({ error: "invalidEmail" }),
      }),
    ),
    defaultValues: {
      email: "",
    },
  })
  const { control, formState } = form
  const { errors } = formState

  const navigate = useNavigate()
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await AmanApiGuest.post("/request-otp", data)
      console.log("🚀 ~ onSubmit ~ response:", response)
      navigate(`/auth/reset-password?email=${encodeURI(data.email)}`)
    } catch (error) {
      handleFormError(error, form)
    }
  })

  return (
    <Stack component={"form"} onSubmit={onSubmit} gap={"lg"}>
      <Controller
        control={control}
        name="email"
        render={({ field }) => {
          return (
            <TextInput
              size="lg"
              label={t("reset-password.send-otp.form.email-label")}
              {...field}
              error={showErrorMessage(errors, "email")}
            />
          )
        }}
      />

      <Button type="submit" loading={form.formState.isSubmitting} size="lg" color="primary">
        {t("reset-password.send-otp.form.send-button")}
      </Button>
      {errors.root ? <p className="text-sm font-medium text-red-500">{errors.root.message}</p> : null}
    </Stack>
  )
}

export default SendOTP
