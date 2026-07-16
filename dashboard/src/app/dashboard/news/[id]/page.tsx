import BackButton from "@/components/common/back-button"
import LangSwitch from "@/components/common/lang-switch"
import Loader from "@/components/common/loader"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Group, Paper, Space, Stack, Text, Title } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import NewsForm from "../components/news-form"
import { GetNewsItem } from "../get-news-item"
import { newsToFormValues } from "../utils/form-values"

const EditNews = () => {
  const params = useParams() as { id: string }
  const { t } = useTranslation()
  const sm = useSmallScreen()

  const { data, status } = useQuery({
    queryKey: ["news", params.id],
    queryFn: async () => GetNewsItem({ id: params.id }),
  })

  if (status === "pending") return <Loader />
  if (status === "error")
    return (
      <Stack p="lg">
        <Text c="red">{t("news.load-error")}</Text>
      </Stack>
    )

  return (
    <Stack>
      <Paper component={Stack} p="lg">
        <Group>
          <BackButton />
          <Title
            className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
            size={sm ? "h3" : "h2"}
            order={2}>
            {t("news.edit.title")}
          </Title>
        </Group>
        <LangSwitch />
      </Paper>
      <Space />
      <NewsForm key={params.id} initialValues={newsToFormValues(data)} />
    </Stack>
  )
}

export default EditNews
