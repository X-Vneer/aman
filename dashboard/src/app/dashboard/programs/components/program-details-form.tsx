import CustomTimeInput from "@/components/common/custom-time-input"
import { WEBSITE_LANGS } from "@/config"
import { useLocalFormStorage } from "@/hooks/use-local-form-storage"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { useNavigate } from "@/lib/i18n/navigation"
import AmanApi from "@/services/aman"
import { UploadFile } from "@/services/utils/upload-file"
import { handleMantineFormError } from "@/utils/handle-mantineform-error"
import { formatTime } from "@/utils/time-formaters"
import {
  ActionIcon,
  Button,
  ColorInput,
  FileButton,
  Group,
  Loader,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { useForm } from "@mantine/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CircleX, Image, Upload, X } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { Video } from "../add/@types"

export type VideoFormValues = Omit<Video, "length"> & {
  time: {
    h: number
    m: number
    s: number
  }
}
const ProgramDetailsForm = ({ initialValues }: { initialValues?: VideoFormValues }) => {
  const { id } = useParams() as { id: string }
  const [lang] = useQueryState("lang", parseAsString.withDefault("ar"))
  const [completedLangs, setCompletedLangs] = useQueryState(
    "completed-langs",
    parseAsArrayOf(parseAsString).withDefault([]),
  )
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const initials = initialValues || {
    video_url: {
      ar: "",
      en: "",
      fr: "",
      id: "",
    },
    logo: "",
    certificate_url: "",
    title: {
      ar: "",
      en: "",
      fr: "",
      id: "",
    },
    description: {
      ar: "",
      en: "",
      fr: "",
      id: "",
    },
    time: {
      h: 0,
      m: 0,
      s: 0,
    },
    color: "",
  }
  const form = useForm<VideoFormValues, Video>({
    mode: "uncontrolled",
    initialValues: {
      ...initials,
    },
    transformValues(values) {
      const { time, ...data } = values
      return {
        ...data,
        length: formatTime(time),
      }
    },
    onValuesChange(values) {
      const localeKeys = ["video_url", "title", "description"] as const

      const completedLocales: string[] = WEBSITE_LANGS.filter((locale) =>
        localeKeys.every((key) => {
          const value = values[key][locale]
          return value.trim() !== ""
        }),
      )

      setCompletedLangs(completedLocales)
    },
  })

  // Persist to localStorage only when a language is fully completed
  const storageKey = `program-details:new`
  const { initialFromStorage, clear } = useLocalFormStorage<VideoFormValues>(
    form.getValues(),
    {
      storageKey,
    },
    id ? false : true,
  )

  // If we have valid cached values, hydrate once
  const hydratedRef = useRef(false)
  useEffect(() => {
    if (!hydratedRef.current && initialFromStorage) {
      form.setValues(initialFromStorage)
      hydratedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFromStorage])

  // handling video logo
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      // uploading file
      const response = await UploadFile({
        file: file,
        path: `/video/logo`,
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
  // handling video certificate
  const uploadCertificate = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      // uploading file
      const response = await UploadFile({
        file: file,
        path: `certificate/${id}`,
      })
      return response.absolutePath
    },
    onSuccess(data) {
      form.setFieldValue("certificate_url", data)
    },
  })

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const onSubmit = form.onSubmit(async (values) => {
    try {
      const response = await (id
        ? AmanApi.put<{
            data: {
              item: {
                id: string
              }
            }
          }>(`/videos/${id}`, values)
        : AmanApi.post<{
            data: {
              item: {
                id: string
              }
            }
          }>("/videos", values))

      if (id) queryClient.invalidateQueries({ queryKey: ["programs"] })
      navigate(id ? "/dashboard/programs" : `/dashboard/programs/${response.data.data.item.id}`)
      // Clear local cache after successful submit
      clear()
    } catch (error) {
      handleMantineFormError(error, form)
    }
  })

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Group justify="space-between">
          <Text className="ltr:!font-customEnglish !text-2xl ltr:!font-normal ltr:!italic">
            {t("programs.add.program-details")}
          </Text>
          <Stack>
            <Button
              loading={form.submitting}
              disabled={completedLangs?.length !== WEBSITE_LANGS.length}
              type="submit"
              className="!px-10">
              {t("global.save")}
            </Button>
            {form.errors.root ? <Text>{form.errors.root}</Text> : null}
          </Stack>
        </Group>
        <div className="flex flex-col flex-nowrap items-start gap-4 lg:flex-row">
          <Stack className="max-md:w-full" gap={"4"}>
            <Text>{t("programs.add.form.add-cover-image")}</Text>
            {form.getValues().logo ? (
              <div className="relative aspect-[2/1.1] w-full overflow-hidden rounded-xl md:w-[300px]">
                <img src={form.getValues().logo} className="h-full w-full object-cover" alt="logo" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="cursor-pointer rounded-xl bg-[#251D1DAD] p-3" onClick={removeLogo}>
                    <Text c={"secondary"} ta={"center"} fz={14}>
                      {t("programs.add.form.replace-logo")}
                    </Text>
                    <Text fz={12} ta={"center"} c={"white"} mt={"sm"}>
                      {t("programs.add.form.logo-width")}
                    </Text>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full md:w-[300px]">
                <Dropzone
                  className="aspect-[2/1.1] w-full rounded-xl border border-gray-100"
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
          <Stack gap={"sm"} w={"100%"}>
            <Space />
            <SimpleGrid cols={{ base: 1, sm: 2, md: 1, lg: 2 }}>
              <TextInput
                label={t(`programs.add.form.video-title-label`)}
                placeholder={t("programs.add.form.video-title-placeholder")}
                key={form.key(`title.${lang}`)}
                {...form.getInputProps(`title.${lang}`)}
              />
            </SimpleGrid>
            <Textarea
              rows={3}
              placeholder={t("programs.add.form.description-placeholder")}
              label={t("programs.add.form.description-label")}
              key={form.key(`description.${lang}`)}
              {...form.getInputProps(`description.${lang}`)}
            />
          </Stack>
        </div>
        <SimpleGrid cols={{ base: 1, sm: 4, md: 1, lg: 4 }}>
          <ColorInput
            label={t(`programs.add.form.video-color-label`)}
            size="md"
            placeholder={t(`programs.add.form.video-color-placeholder`)}
            key={form.key(`color`)}
            {...form.getInputProps(`color`)}
          />
          <TextInput
            type="url"
            label={t(`programs.add.form.video_url`)}
            placeholder={t("programs.add.form.video_url_placeholder")}
            key={form.key(`video_url.${lang}`)}
            {...form.getInputProps(`video_url.${lang}`)}
            rightSection={
              <ActionIcon
                onClick={() => {
                  form.setFieldValue(`video_url.${lang}`, "")
                }}
                variant="transparent"
                color="red">
                <CircleX color="red" />
              </ActionIcon>
            }
          />
          <FileButton
            onChange={(file) => {
              if (!file) return
              uploadCertificate.mutate({ file })
            }}
            accept="image/png,image/jpeg">
            {(props) => (
              <TextInput
                leftSection={uploadCertificate.isPending ? <Loader size={"xs"} /> : null}
                readOnly
                type="url"
                label={t(`programs.add.form.certificate_url`)}
                placeholder={t("programs.add.form.certificate_url_placeholder")}
                key={form.key(`certificate_url`)}
                {...form.getInputProps(`certificate_url`)}
                rightSection={
                  <ActionIcon
                    onClick={() => {
                      form.setFieldValue(`certificate_url`, "")
                    }}
                    variant="transparent"
                    color="red">
                    <CircleX color="red" />
                  </ActionIcon>
                }
                {...props}
              />
            )}
          </FileButton>

          <CustomTimeInput formKey="time" form={form} label={t(`programs.add.form.lenght-label`)} />
        </SimpleGrid>
      </Stack>
    </form>
  )
}

export default ProgramDetailsForm
