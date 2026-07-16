import CustomTimeInput from "@/components/common/custom-time-input"
import { WEBSITE_LANGS } from "@/config"
import { useSmallScreen } from "@/hooks/use-small-screen"
import AmanApi from "@/services/aman"
import { UploadFile } from "@/services/utils/upload-file"
import { handleMantineFormError } from "@/utils/handle-mantineform-error"
import { Button, Group, SimpleGrid, Stack, Text, TextInput } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { useForm } from "@mantine/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Image, Upload, X } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { Scene } from "../@types"
import { formatTime, formatTimeDifference, parseTime } from "@/utils/time-formaters"
import { useNavigate } from "@/lib/i18n/navigation"

export type VideoFormValues = Omit<Scene, "end_time" | "start_time"> & {
  end_time: {
    h: number
    m: number
    s: number
  }

  start_time: {
    h: number
    m: number
    s: number
  }
}
const SceneForm = ({ initialValues }: { initialValues?: VideoFormValues }) => {
  const { id, sceneId } = useParams() as { id: string; sceneId?: string }
  const [lang] = useQueryState("lang", parseAsString.withDefault("ar"))
  const [completedLangs, setCompletedLangs] = useQueryState(
    "completed-langs",
    parseAsArrayOf(parseAsString).withDefault([]),
  )
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const initials = initialValues || {
    logo: "",
    title: {
      ar: "",
      en: "",
      fr: "",
      id: "",
    },
    start_time: {
      h: 0,
      m: 0,
      s: 0,
    },
    end_time: {
      h: 0,
      m: 0,
      s: 0,
    },
  }
  const form = useForm<VideoFormValues, Scene>({
    mode: "uncontrolled",
    initialValues: initials,
    transformValues(values) {
      const { start_time, end_time, ...data } = values
      return {
        ...data,
        start_time: formatTime(start_time),
        end_time: formatTime(end_time),
      }
    },
    onValuesChange(values) {
      const localeKeys = ["title"] as const

      const completedLocales: string[] = WEBSITE_LANGS.filter((locale) =>
        localeKeys.every((key) => {
          const value = values[key][locale]
          return value.trim() !== ""
        }),
      )

      setCompletedLangs(completedLocales)
    },
  })

  // handling video logo
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      // uploading file
      const response = await UploadFile({
        file: file,
        path: `/scene/logo`,
      })
      return response.absolutePath
    },
    onSuccess(data) {
      form.setFieldValue("logo", data)
    },
  })

  const removeLogo = () => {
    form.setFieldValue("logo", "")
  }

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const onSubmit = form.onSubmit(async (values) => {
    try {
      const data = {
        ...values,
        video_id: id,
        length: formatTimeDifference(parseTime(values.start_time), parseTime(values.end_time)),
      }
      const response = await (sceneId
        ? AmanApi.put(`/scenes/${sceneId}`, data)
        : AmanApi.post("/scenes", data))

      if (sceneId) queryClient.invalidateQueries({ queryKey: ["scenes", sceneId] })
      if (sceneId) queryClient.invalidateQueries({ queryKey: ["programs", id] })

      navigate(`/dashboard/programs/${id}`)
    } catch (error) {
      handleMantineFormError(error, form)
    }
  })

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Group justify="space-between">
          <Text className="ltr:!font-customEnglish !text-2xl ltr:!font-normal ltr:!italic">
            {t("scenes.add.program-details")}
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
        <div className="flex flex-col flex-nowrap items-start gap-4 lg:flex-row">
          <Stack className="max-md:w-full" gap={"4"}>
            <Text>{t("scenes.add.form.add-cover-image")}</Text>
            {form.getValues().logo ? (
              <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl md:w-[300px]">
                <img src={form.getValues().logo} className="h-full w-full object-cover" alt="logo" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="cursor-pointer rounded-xl bg-[#251D1DAD] p-3" onClick={removeLogo}>
                    <Text c={"secondary"} ta={"center"} fz={14}>
                      {t("general.replace-logo")}
                    </Text>
                    <Text fz={12} ta={"center"} c={"white"} mt={"sm"}>
                      {t("general.logo-width")}
                    </Text>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full md:w-[300px]">
                <Dropzone
                  className="aspect-[2/1] w-full rounded-xl border border-gray-100"
                  multiple={false}
                  onDrop={(files) => {
                    mutate({ file: files[0] })
                  }}
                  loading={isPending}
                  maxSize={5 * 1024 ** 2}
                  accept={IMAGE_MIME_TYPE}
                  classNames={{
                    inner: "!h-full",
                  }}>
                  <Group justify="center" gap="xl" h={"100%"} style={{ pointerEvents: "none" }}>
                    <Dropzone.Accept>
                      <Upload size={52} color="var(--mantine-color-blue-6)" strokeWidth={1.3} />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <X size={52} color="var(--mantine-color-red-6)" strokeWidth={1.3} />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <Image size={52} color="var(--mantine-color-dimmed)" strokeWidth={1.3} />
                    </Dropzone.Idle>
                  </Group>
                </Dropzone>
                {isError ? (
                  <Text c={"red"} size="sm">
                    {error.message}
                  </Text>
                ) : null}
              </div>
            )}
          </Stack>
          <TextInput
            w={"100%"}
            label={t(`scenes.add.form.scene-title-label`)}
            placeholder={t("scenes.add.form.scene-title-placeholder")}
            key={form.key(`title.${lang}`)}
            {...form.getInputProps(`title.${lang}`)}
          />
        </div>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <CustomTimeInput formKey="start_time" form={form} label={t(`scenes.add.form.start_time-label`)} />
          <CustomTimeInput formKey="end_time" form={form} label={t(`scenes.add.form.end_time-label`)} />
        </SimpleGrid>
      </Stack>
    </form>
  )
}

export default SceneForm
