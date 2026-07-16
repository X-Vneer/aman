import BackButton from "@/components/common/back-button"
import LangSwitch from "@/components/common/lang-switch"
import Loader from "@/components/common/loader"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Group, Paper, Space, Stack, Text, Title } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import BlogForm from "../components/blog-form"
import { GetBlog } from "../get-blog"
import { blogToFormValues } from "../utils/form-values"

const EditBlog = () => {
  const params = useParams() as { id: string }
  const { t } = useTranslation()
  const sm = useSmallScreen()

  const { data, status } = useQuery({
    queryKey: ["blogs", params.id],
    queryFn: async () => GetBlog({ id: params.id }),
  })

  if (status === "pending") return <Loader />
  if (status === "error")
    return (
      <Stack p="lg">
        <Text c="red">{t("blogs.load-error")}</Text>
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
            {t("blogs.edit.title")}
          </Title>
        </Group>
        <LangSwitch />
      </Paper>
      <Space />
      <BlogForm key={params.id} initialValues={blogToFormValues(data)} />
    </Stack>
  )
}

export default EditBlog
