import Loader from "@/components/common/loader"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { useParams } from "@/lib/i18n/navigation"
import { parseTime } from "@/utils/time-formaters"
import { Group, Paper, Space, Stack, Title } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import SceneForm from "../components/scene-form"
import LangSwitch from "@/components/common/lang-switch"
import { GetScene } from "../../../get-scene"
import BackButton from "@/components/common/back-button"

const EditScene = () => {
  const params = useParams() as { sceneId: string }
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const { data, status } = useQuery({
    queryKey: ["scene", params.sceneId],
    queryFn: async () => {
      const response = await GetScene({ id: params.sceneId })
      return response.data.data.item
    },
  })

  if (status === "pending") return <Loader />
  if (status === "error") return <div>error</div>
  const initialValues = {
    logo: data.logo,
    title: {
      ...data.title,
    },
    start_time: parseTime(data.start_time),
    end_time: parseTime(data.end_time),
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
            {t("scenes.edit.title")}
          </Title>
        </Group>
        <LangSwitch />
      </Paper>
      <Space />
      <SceneForm initialValues={initialValues} />
    </Stack>
  )
}

export default EditScene
