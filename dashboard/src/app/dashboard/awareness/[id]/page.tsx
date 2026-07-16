import LangSwitch from "@/components/common/lang-switch"
import Loader from "@/components/common/loader"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { useParams } from "@/lib/i18n/navigation"
import { Paper, Space, Stack, Title } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import AwarenessForm from "../components/awareness-form"
import { GetSingleAwareness } from "../get-single-awareness"

const EditAwarenessPage = () => {
  const params = useParams() as { id: string }
  const { t } = useTranslation()
  const sm = useSmallScreen()

  const { data, status } = useQuery({
    queryKey: ["awareness", params.id],
    queryFn: async () => {
      const response = await GetSingleAwareness({ id: params.id })
      return response.data.data.item
    },
  })

  if (status === "pending") return <Loader />
  if (status === "error") return <div>error</div>
  const initialValues = data

  return (
    <Stack>
      <Paper component={Stack} p={"lg"}>
        <Title
          className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
          size={sm ? "h3" : "h2"}
          order={2}>
          {t("awareness.edit.title")}
        </Title>
        <LangSwitch />
      </Paper>
      <Space />
      <AwarenessForm initialValues={initialValues} />
    </Stack>
  )
}

export default EditAwarenessPage
