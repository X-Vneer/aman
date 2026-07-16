import RichTextEditor from "@/components/common/rich-text-editor"
import { WEBSITE_LANGS } from "@/config"
import { useNavigate } from "@/lib/i18n/navigation"
import { UploadFile } from "@/services/utils/upload-file"
import { CreateNewsInput, CreateNewsSchema } from "@/validation/news"
import { handleMantineFormError } from "@/utils/handle-mantineform-error"
import { Button, Group, Paper, SimpleGrid, Stack, TagsInput, Text, Textarea, TextInput } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { useForm } from "@mantine/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { Upload, UploadCloud, X } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { createNews, updateNews } from "../services"
import { emptyCreateNewsValues } from "../utils/form-values"

function completedNewsLocales(values: CreateNewsInput): string[] {
  return WEBSITE_LANGS.filter((locale) => {
    const title = String(values.title[locale] ?? "").trim()
    const short = String(values.short_description[locale] ?? "").trim()
    const content = String(values.content[locale] ?? "").trim()
    return title !== "" && short !== "" && content !== ""
  })
}

const NewsForm = ({ initialValues }: { initialValues?: CreateNewsInput }) => {
  const { id } = useParams() as { id?: string }
  const [lang] = useQueryState("lang", parseAsString.withDefault("ar"))
  const [completedLangs, setCompletedLangs] = useQueryState(
    "completed-langs",
    parseAsArrayOf(parseAsString).withDefault([]),
  )
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<CreateNewsInput>({
    initialValues: initialValues ?? emptyCreateNewsValues(),
    onValuesChange(values) {
      setCompletedLangs(completedNewsLocales(values))
    },
  })

  useEffect(() => {
    setCompletedLangs(completedNewsLocales(form.getValues()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, id])

  const {
    mutate: uploadLogo,
    isPending: uploadPending,
    isError: uploadError,
    error: uploadErr,
  } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const response = await UploadFile({ file, path: "news" })
      return response.absolutePath
    },
    onSuccess(data) {
      form.setFieldValue("logo", data)
    },
  })

  const onSubmit = form.onSubmit(async (values) => {
    const parsed = CreateNewsSchema.safeParse(values)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      const errors: Record<string, string> = {}
      for (const key of Object.keys(fieldErrors) as string[]) {
        const msgs = fieldErrors[key as keyof typeof fieldErrors]
        const code = msgs?.[0]
        if (code) {
          errors[key] =
            code === "required"
              ? t("validation.required")
              : code === "long"
                ? t("validation.long")
                : code === "invalidUrl"
                  ? t("validation.invalidUrl")
                  : code
        }
      }
      form.setErrors(errors)
      return
    }
    try {
      if (id) {
        await updateNews(id, parsed.data)
        await queryClient.invalidateQueries({ queryKey: ["news", id] })
      } else {
        await createNews(parsed.data)
      }
      await queryClient.invalidateQueries({ queryKey: ["news"] })
      navigate("/dashboard/news")
    } catch (error) {
      handleMantineFormError(error, form)
    }
  })

  const removeLogo = () => form.setFieldValue("logo", "")

  const activeLang = WEBSITE_LANGS.includes(lang as (typeof WEBSITE_LANGS)[number])
    ? (lang as (typeof WEBSITE_LANGS)[number])
    : WEBSITE_LANGS[0]

  return (
    <form onSubmit={onSubmit}>
      <Group p="lg" justify="flex-end">
        <Stack gap={4} align="flex-end">
          <Button
            type="submit"
            loading={form.submitting}
            disabled={completedLangs?.length !== WEBSITE_LANGS.length}
            className="px-10!">
            {t("common.save")}
          </Button>
          {form.errors.root ? <Text c="red">{form.errors.root}</Text> : null}
        </Stack>
      </Group>
      <Stack p="lg" gap="lg">
        <Paper p="md" radius="md">
          <Stack gap="md">
            <Text className="ltr:font-customEnglish! text-lg! ltr:font-normal! ltr:italic!">
              {t("news.form.details")}
            </Text>
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                {t("news.form.logo")}
              </Text>
              {form.values.logo ? (
                <div className="relative aspect-1000/230 w-full overflow-hidden rounded-xl border border-gray-100">
                  <img src={form.values.logo} className="h-full w-full object-cover" alt="" />
                  <div
                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100"
                    onClick={removeLogo}>
                    <Text c="white" size="sm">
                      {t("general.replace-logo")}
                    </Text>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <Dropzone
                    className="aspect-1000/230 w-full rounded-xl border-2 border-dashed border-violet-500 bg-[#f9f7ff] transition-colors data-accept:border-violet-600 data-accept:bg-violet-50 data-reject:border-red-400 data-reject:bg-red-50"
                    multiple={false}
                    onDrop={(files) => uploadLogo({ file: files[0] })}
                    loading={uploadPending}
                    maxSize={5 * 1024 ** 2}
                    accept={IMAGE_MIME_TYPE}
                    classNames={{ inner: "!flex !h-full !min-h-0 !items-center !justify-center" }}
                    styles={{ root: { borderStyle: "dashed" } }}>
                    <Dropzone.Accept>
                      <Stack
                        align="center"
                        justify="center"
                        gap={8}
                        py="md"
                        style={{ pointerEvents: "none" }}>
                        <Upload size={40} color="#7c3aed" strokeWidth={1.5} />
                        <Text fw={600} size="sm" c="dark.7" ta="center">
                          {t("news.form.logo_upload_title")}
                        </Text>
                        <Text size="xs" c="dimmed" ta="center">
                          {t("news.form.logo_recommended_size")}
                        </Text>
                      </Stack>
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <Stack
                        align="center"
                        justify="center"
                        gap={8}
                        py="md"
                        style={{ pointerEvents: "none" }}>
                        <X size={40} color="var(--mantine-color-red-6)" strokeWidth={1.5} />
                        <Text fw={600} size="sm" c="dark.7" ta="center">
                          {t("news.form.logo_upload_title")}
                        </Text>
                        <Text size="xs" c="dimmed" ta="center">
                          {t("news.form.logo_recommended_size")}
                        </Text>
                      </Stack>
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <Stack
                        align="center"
                        justify="center"
                        gap={8}
                        py="md"
                        style={{ pointerEvents: "none" }}>
                        <UploadCloud size={44} color="#a855f7" strokeWidth={1.5} />
                        <Text fw={600} size="sm" c="dark.7" ta="center">
                          {t("news.form.logo_upload_title")}
                        </Text>
                        <Text size="xs" c="dimmed" ta="center">
                          {t("news.form.logo_recommended_size")}
                        </Text>
                      </Stack>
                    </Dropzone.Idle>
                  </Dropzone>
                  {uploadError ? (
                    <Text c="red" size="sm" mt="xs">
                      {uploadErr?.message}
                    </Text>
                  ) : null}
                </div>
              )}
              {form.errors.logo ? (
                <Text c="red" size="sm">
                  {form.errors.logo}
                </Text>
              ) : null}
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <DateInput
                label={t("news.form.publish_date")}
                placeholder={t("news.form.publish_date_placeholder")}
                value={form.values.publish_date ? new Date(form.values.publish_date) : null}
                onChange={(d) => form.setFieldValue("publish_date", d ? dayjs(d).format("YYYY-MM-DD") : "")}
                valueFormat="YYYY-MM-DD"
                error={form.errors.publish_date}
              />
              <TagsInput
                label={t("news.form.tags")}
                placeholder={t("news.form.tags_placeholder")}
                {...form.getInputProps("tags")}
              />
            </SimpleGrid>
            <TextInput
              size="sm"
              label={t("news.form.title")}
              placeholder={t("news.form.title_placeholder")}
              key={form.key(`title.${activeLang}`)}
              {...form.getInputProps(`title.${activeLang}`)}
            />
            <Textarea
              label={t("news.form.short_description")}
              placeholder={t("news.form.short_description_placeholder")}
              maxLength={500}
              autosize
              minRows={2}
              key={form.key(`short_description.${activeLang}`)}
              {...form.getInputProps(`short_description.${activeLang}`)}
            />
            <RichTextEditor
              label={t("news.form.content")}
              placeholder={t("news.form.content_placeholder")}
              minHeight={280}
              key={form.key(`content.${activeLang}`)}
              {...form.getInputProps(`content.${activeLang}`)}
            />
          </Stack>
        </Paper>
      </Stack>
    </form>
  )
}

export default NewsForm
