import LangSwitch from "@/components/common/lang-switch"
import Loader from "@/components/common/loader"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { useParams } from "@/lib/i18n/navigation"
import { parseTime } from "@/utils/time-formaters"
import { Group, Paper, Space, Stack, Title } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { GetQuestion } from "../../../get-question"
import QuestionForm from "../components/question-form"
import BackButton from "@/components/common/back-button"
import { Question } from "../../../@types"

const EditQuestion = () => {
  const params = useParams() as { questionId: string }
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const { data, status } = useQuery<Question>({
    queryKey: ["question", params.questionId],
    queryFn: async () => {
      const response = await GetQuestion({ id: params.questionId })
      return response.data.data.item
    },
  })

  if (status === "pending") return <Loader />
  if (status === "error") return <div>error</div>
  const initialValues = {
    ...data,
    appears_at: {
      ar: parseTime(data.appears_at.ar),
      en: parseTime(data.appears_at.en),
      fr: parseTime(data.appears_at.fr),
      ur: parseTime(data.appears_at.ur),
      fil: parseTime(data.appears_at.fil),
      id: parseTime(data.appears_at.id),
    },
    allowed_time: parseTime(data.allowed_time),
  }
  return (
    <Stack>
      <Paper component={Stack} p={"lg"}>
        <Group>
          <BackButton />

          <Title
            className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
            size={sm ? "h3" : "h2"}
            order={2}>
            {t("questions.edit.title")}
          </Title>
        </Group>
        <LangSwitch />
      </Paper>
      <Space />
      <QuestionForm initialValues={initialValues} />
    </Stack>
  )
}

export default EditQuestion
