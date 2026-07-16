import { LoginResponse } from "@/@types/user"
import { emailGlow } from "@/assets"
import { LOCALSTORAGE_SESSION_KEY } from "@/config"
import { Link, useNavigate } from "@/lib/i18n/navigation"
import { AmanApiGuest } from "@/services/aman"
import { handleFormError } from "@/utils/handle-form-errors"
import { OTPSchema } from "@/validation/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, PinInput, Stack, Text, Title } from "@mantine/core"
import { parseAsString, useQueryState } from "nuqs"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

const OTP = () => {
  const { t } = useTranslation()
  const form = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otp: "",
    },
  })
  const { control, formState } = form
  const { errors } = formState

  const navigate = useNavigate()
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const response = await AmanApiGuest.post<LoginResponse>("/otpVerify", { ...data, email })
      console.log("🚀 ~ onSubmit ~ response:", response)
      const user = response.data.data
      localStorage.setItem(LOCALSTORAGE_SESSION_KEY, JSON.stringify(user))
      navigate("/dashboard")
    } catch (error) {
      handleFormError(error, form)
    }
  })

  const [email] = useQueryState("email", parseAsString.withDefault(""))

  useEffect(() => {
    if (!email) {
      navigate("/auth/login")
    }
  }, [email, navigate])

  return (
    <Stack gap={"lg"}>
      <img src={emailGlow} alt={"email grow"} className="mx-auto size-12" />
      <div className="space-y-1 text-center">
        <Title order={4}>{t("otp.title")}</Title>
        <Text size="sm" c="gray.5">
          {t("otp.description")}
          {email}
        </Text>
      </div>
      <Stack component={"form"} onSubmit={onSubmit} gap={"lg"}>
        <div className="mx-auto w-fit space-y-2">
          <div>
            <Controller
              control={control}
              name="otp"
              render={({ field }) => {
                return <PinInput classNames={{ input: "!border-2" }} {...field} size="xl" />
              }}
            />
          </div>
          <Text c={"#5A5A5A"} size="sm">
            {t("otp.no-otp")}

            <Link to={"/auth/login"}>{t("otp.resend-button")}</Link>
          </Text>
        </div>
        <div className="mx-auto w-full max-w-[270px]">
          <Button fullWidth type="submit" loading={form.formState.isSubmitting} size="lg" color="primary">
            {t("otp.verify-button")}
          </Button>
        </div>

        {errors.root ? <p className="text-sm font-medium text-red-500">{errors.root.message}</p> : null}
      </Stack>
    </Stack>
  )
}

export default OTP
