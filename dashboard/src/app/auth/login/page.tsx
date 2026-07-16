import { Link, useNavigate } from "@/lib/i18n/navigation"
import { AmanApiGuest } from "@/services/aman"
import { handleFormError } from "@/utils/handle-form-errors"
import { showErrorMessage } from "@/utils/show-error-message"
import { LoginSchema } from "@/validation/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

const Login = () => {
  const { t } = useTranslation()
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const { control, formState } = form
  const { errors } = formState

  const navigate = useNavigate()
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await AmanApiGuest.post("/loginRegisterResendOtp", data)
      console.log("🚀 ~ onSubmit ~ response:", response)
      navigate(`/auth/otp?email=${encodeURI(data.email)}`)
    } catch (error) {
      handleFormError(error, form)
    }
  })

  return (
    <Stack gap={"xl"}>
      <div className="space-y-1 text-center">
        <Title order={2}>{t("login.title")}</Title>
        <Text c="gray.5">{t("login.description")}</Text>
      </div>
      <Stack component={"form"} onSubmit={onSubmit} gap={"lg"}>
        <Controller
          control={control}
          name="email"
          render={({ field }) => {
            return (
              <TextInput
                size="lg"
                label={t("login.form.email-label")}
                {...field}
                error={showErrorMessage(errors, "email")}
              />
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
                label={t("login.form.password-label")}
                {...field}
                error={showErrorMessage(errors, "password")}
              />
            )
          }}
        />
        <div>
          <Link className="text-sm font-semibold text-primary" to={"/auth/reset-password"}>
            {t("login.form.forgot-password")}
          </Link>
        </div>
        <Button type="submit" loading={form.formState.isSubmitting} size="lg" color="primary">
          {t("login.form.sign-in-button")}
        </Button>
        {errors.root ? <p className="text-sm font-medium text-red-500">{errors.root.message}</p> : null}
      </Stack>
    </Stack>
  )
}

export default Login
