import { useSmallScreen } from "@/hooks/use-small-screen"
import { Group, Paper, Space, Stack, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import ProgramDetailsForm from "../components/program-details-form"
import LangSwitch from "@/components/common/lang-switch"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "@/lib/i18n/navigation"
import { GetVideo } from "../get-video"
import Loader from "@/components/common/loader"
import Scenes from "./components/scenes"
import { parseTime } from "@/utils/time-formaters"
import Questions from "./components/questions"
import BackButton from "@/components/common/back-button"

const EditProgram = () => {
  const params = useParams() as { id: string }
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const { data, status } = useQuery({
    queryKey: ["programs", params.id],
    queryFn: async () => {
      const response = await GetVideo({ id: params.id })
      return response.data.data.item
    },
  })

  if (status === "pending") return <Loader />
  if (status === "error") return <div>error</div>
  const initialValues = {
    video_url: data.video_url,
    logo: data.logo,
    color: data.color,
    certificate_url: data.certificate_url,
    price: data.price,
    price_original: data.price_original,
    title: data.title,
    description: data.description,
    time: parseTime(data.length),
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
            {t("programs.edit.title")}
          </Title>
        </Group>
        <LangSwitch />
      </Paper>
      <Space />
      <ProgramDetailsForm initialValues={initialValues} />
      <Space />
      <Space />

      <Questions questions={data.questions} />
      <Scenes scenes={data.scenes} />
    </Stack>
  )
}

export default EditProgram
