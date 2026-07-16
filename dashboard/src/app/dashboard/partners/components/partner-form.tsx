import BackButton from "@/components/common/back-button"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { useNavigate } from "@/lib/i18n/navigation"
import AmanApi from "@/services/aman"
import { UploadFile } from "@/services/utils/upload-file"
import { handleMantineFormError } from "@/utils/handle-mantineform-error"
import { Button, Group, Space, Stack, Text, TextInput, Title } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { useForm } from "@mantine/form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Image, Upload, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { PartnerFormValues } from "../add/@types"

const PartnerForm = ({ initialValues }: { initialValues?: PartnerFormValues }) => {
  const { id } = useParams()
  const { t } = useTranslation()
  const sm = useSmallScreen()

  const form = useForm<PartnerFormValues>({
    initialValues: initialValues || {
      name: "",
      logo: "",
    },
    validate: {
      name: (value) => (!value ? t("validation.required") : null),
      logo: (value) => (!value ? t("validation.required") : null),
    },
  })

  // handling video certificate
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      // uploading file
      const response = await UploadFile({
        file: file,
        path: `logos`,
      })
      return response.absolutePath
    },
    onSuccess(data) {
      form.setFieldValue("logo", data)
    },
  })

  const removeFile = () => {
    form.setFieldValue("logo", "")
  }

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
          }>(`/partners/${id}`, values)
        : AmanApi.post<{
            data: {
              item: {
                id: string
              }
            }
          }>("/partners", values))

      queryClient.invalidateQueries({ queryKey: ["partners"] })
      navigate("/dashboard/partners")
    } catch (error) {
      handleMantineFormError(error, form)
    }
  })

  return (
    <form onSubmit={onSubmit}>
      <Group p={"lg"} justify="space-between">
        <Group>
          <BackButton />
          <Title
            className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
            size={sm ? "h3" : "h2"}
            order={2}>
            {t("partners.add.title")}
          </Title>
        </Group>
        <Button type="submit" loading={form.submitting}>
          {t("common.save")}
        </Button>
      </Group>
      <Space />
      <Stack p="lg" gap="lg">
        <Group>
          {/* Logo Upload Section */}
          <Stack gap="sm">
            <Text size="sm" fw={500}>
              {t("partners.add.logo-label")}
            </Text>

            {form.getValues().logo ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-xl md:w-[150px]">
                <img src={form.getValues().logo} className="h-full w-full object-cover" alt="logo" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="cursor-pointer rounded-xl bg-[#251D1DAD] p-3" onClick={removeFile}>
                    <Text c={"secondary"} ta={"center"} fz={14}>
                      {t("general.replace-logo")}
                    </Text>
                    <Text fz={12} ta={"center"} c={"white"} mt={"sm"}>
                      {t("partners.add.logo-dimensions")}
                    </Text>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full md:w-[150px]">
                <Dropzone
                  className="aspect-square w-full rounded-xl border border-gray-100"
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

          {/* Partner Name Section */}
          <Stack gap="sm" className="grow">
            <Text size="sm" fw={500}>
              {t("partners.add.name-label")}
            </Text>
            <TextInput placeholder={t("partners.add.name-placeholder")} {...form.getInputProps("name")} />
          </Stack>
        </Group>
        <Stack gap="0">
          <Text size="sm">{t("partners.add.logo-dimensions")}</Text>
          <Text size="sm">{t("partners.add.logo-note")}</Text>
        </Stack>
        {/* Submit Button */}
        {/* <Group justify="flex-end" mt="md">
          
        </Group> */}
      </Stack>
    </form>
  )
}

export default PartnerForm
