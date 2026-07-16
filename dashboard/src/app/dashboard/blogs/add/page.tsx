import BackButton from "@/components/common/back-button"
import LangSwitch from "@/components/common/lang-switch"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Group, Paper, Space, Stack, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import BlogForm from "../components/blog-form"

const AddBlog = () => {
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
            {t("blogs.add.title")}
          </Title>
        </Group>
        <LangSwitch />
      </Paper>
      <Space />
      <BlogForm />
    </Stack>
  )
}

export default AddBlog
