import { WEBSITE_LANGS } from "@/config"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { useNavigate } from "@/lib/i18n/navigation"
import AmanApi from "@/services/aman"
import { handleMantineFormError } from "@/utils/handle-mantineform-error"
import {
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  TagsInput,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { AddAwareness } from "../@types"
import { useEffect } from "react"
import { getVideos } from "@/services/utils/get-videos"
import { GetAwareness } from "../get-awareness"

const AwarenessForm = ({ initialValues }: { initialValues?: AddAwareness }) => {
  const { id } = useParams() as { id?: string }
  const [lang] = useQueryState("lang", parseAsString.withDefault("ar"))
  const [completedLangs, setCompletedLangs] = useQueryState(
    "completed-langs",
    parseAsArrayOf(parseAsString).withDefault([]),
  )
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const initials = initialValues || {
    video_id: "",
    title: {
      ar: "",
      en: "",
      fr: "",
      ur: "",
      fil: "",
      id: "",
    },
    description: {
      ar: "",
      en: "",
      fr: "",
      ur: "",
      fil: "",
      id: "",
    },
    symptoms: {
      ar: [],
      en: [],
      fr: [],
      ur: [],
      fil: [],
      id: [],
    },
  }
  const form = useForm<AddAwareness>({
    mode: "uncontrolled",
    initialValues: initials,

    onValuesChange(values) {
      const localeKeys = ["title", "description", "symptoms"] as const

      const completedLocales: string[] = WEBSITE_LANGS.filter((locale) =>
        localeKeys.every((key) => {
          const value = values[key][locale]
          if (Array.isArray(value)) {
            return value.toString().replace(",", "").trim() !== ""
          }
          return value.trim() !== ""
        }),
      )

      setCompletedLangs(completedLocales)
    },
  })

  const navigate = useNavigate()
  const onSubmit = form.onSubmit(async (data) => {
    try {
      const response = await (id
        ? AmanApi.put(`/awareness/${id}`, data)
        : AmanApi.post("/awareness", data))

      if (id) queryClient.invalidateQueries({ queryKey: ["awareness", id] })

      navigate(`/dashboard/awareness`)
    } catch (error) {
      handleMantineFormError(error, form)
    }
  })

  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ["list", "videos"],
    queryFn: () => getVideos(),
  })
  const programsData = data?.map((ele) => {
    return {
      value: ele.id + "",
      label: ele.title,
    }
  })

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Group justify="space-between">
          <Text className="!text-2xl ltr:!font-customEnglish ltr:!font-normal ltr:!italic">
            {t("awareness.add.details")}
          </Text>
          <Stack>
            <Button
              loading={form.submitting}
              disabled={completedLangs?.length !== WEBSITE_LANGS.length}
              type="submit"
              className="!px-10">
              {t("global.save")}
            </Button>
            {form.errors.root ? <Text c="red">{form.errors.root}</Text> : null}
          </Stack>
        </Group>
        <Stack>
          <Select
            label={t("awareness.form.video_id_label")}
            placeholder={t(`global.select`)}
            data={programsData || []}
            key={form.key(`video_id`)}
            {...form.getInputProps(`video_id`)}
          />
        </Stack>
        <Paper p={"md"} radius={"md"}>
          <Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                label={t(`awareness.add.form.awareness-title-label`)}
                placeholder={t("awareness.add.form.awareness-title-placeholder")}
                key={form.key(`title.${lang}`)}
                {...form.getInputProps(`title.${lang}`)}
              />
              <Textarea
                label={t(`awareness.add.form.awareness-description-label`)}
                placeholder={t("awareness.add.form.awareness-description-placeholder")}
                key={form.key(`description.${lang}`)}
                {...form.getInputProps(`description.${lang}`)}
              />
            </SimpleGrid>
          </Stack>
          <TagsInput
            size="md"
            label={t(`awareness.add.form.symptoms-title-label`)}
            placeholder={t("awareness.add.form.symptoms-title-placeholder")}
            key={form.key(`symptoms.${lang}`)}
            {...form.getInputProps(`symptoms.${lang}`)}
          />
        </Paper>
      </Stack>
    </form>
  )
}

export default AwarenessForm
