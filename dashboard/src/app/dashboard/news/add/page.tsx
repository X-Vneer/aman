import BackButton from "@/components/common/back-button"
import LangSwitch from "@/components/common/lang-switch"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Group, Paper, Space, Stack, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import NewsForm from "../components/news-form"

const AddNews = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()

  return (
    <Stack>
      <Paper component={Stack} p="lg">
        <Group>
          <BackButton />
          <Title
            className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
            size={sm ? "h3" : "h2"}
            order={2}>
            {t("news.add.title")}
          </Title>
        </Group>
        <LangSwitch />
      </Paper>
      <Space />
      <NewsForm />
    </Stack>
  )
}

export default AddNews
