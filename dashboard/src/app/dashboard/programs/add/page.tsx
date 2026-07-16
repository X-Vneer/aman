import { useSmallScreen } from "@/hooks/use-small-screen"
import { Paper, Space, Stack, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import LangSwitch from "@/components/common/lang-switch"
import ProgramDetailsForm from "../components/program-details-form"

const AddProgram = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()

  return (
    <Stack>
      <Paper component={Stack} p={"lg"}>
        <Title
          className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
          size={sm ? "h3" : "h2"}
          order={2}>
          {t("programs.add.title")}
        </Title>
        <LangSwitch />
      </Paper>
      <Space />
      <ProgramDetailsForm />
    </Stack>
  )
}

export default AddProgram
