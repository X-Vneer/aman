import { Stack, Text, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import ResetForm from "./components/reset-password-form"
import SendOTP from "./components/send-otp"

const ResetPassword = () => {
  const { t } = useTranslation()

  const searchParams = useOptimisticSearchParams()
  const email = searchParams.get("email")
  return (
    <Stack gap={"xl"}>
      <div className="space-y-1 text-center">
        <Title order={2}>{t("reset-password.title")}</Title>
        <Text c="gray.5">{t("reset-password.description")}</Text>
      </div>
      {email ? <ResetForm /> : <SendOTP />}
    </Stack>
  )
}

export default ResetPassword
