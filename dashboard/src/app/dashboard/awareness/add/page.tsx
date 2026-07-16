import LangSwitch from "@/components/common/lang-switch"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { useParams } from "@/lib/i18n/navigation"
import { Paper, Space, Stack, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import AwarenessForm from "../components/awareness-form"

const AddAwarenessPage = () => {
  const params = useParams() as { id: string }
  const { t } = useTranslation()
  const sm = useSmallScreen()

  return (
    <Stack>
      <Paper component={Stack} p={"lg"}>
        <Title
          className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
          size={sm ? "h3" : "h2"}
          order={2}>
          {t("awareness.add.title")}
        </Title>
        <LangSwitch />
      </Paper>
      <Space />
      <AwarenessForm />
    </Stack>
  )
}

export default AddAwarenessPage
