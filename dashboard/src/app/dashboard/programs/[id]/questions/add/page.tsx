import { useSmallScreen } from "@/hooks/use-small-screen"
import { Paper, Space, Stack, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import LangSwitch from "@/components/common/lang-switch"
import QuestionForm from "../components/question-form"

const AddQuestion = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()

  return (
    <Stack>
      <Paper component={Stack} p={"lg"}>
        <Title
          className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
          size={sm ? "h3" : "h2"}
          order={2}>
          {t("questions.add.title")}
        </Title>
        <LangSwitch />
      </Paper>
      <Space />
      <QuestionForm />
    </Stack>
  )
}

export default AddQuestion
