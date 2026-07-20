import { UploadFile } from "@/services/utils/upload-file"
import { Alert, Button, Modal } from "@mantine/core"
import "@mantine/dropzone/styles.css"
import { useDisclosure } from "@mantine/hooks"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trans, useTranslation } from "react-i18next"

import { Group, Text } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { ImageUp, Upload, X } from "lucide-react"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { useState } from "react"
import { PutUpdateCertificate } from "../update-certificate"
import { notifications } from "@mantine/notifications"
import axios from "axios"

const UploadModal = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()

  const [isOpen, { open, close }] = useDisclosure()
  const [fileToUpload, setFileToUpload] = useState<File[]>([])
  const onCancel = () => {
    setFileToUpload([])
    close()
  }

  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const response = await UploadFile({ file, path: "certificate/global" })
      return PutUpdateCertificate({ image: response.relativePath })
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["certificate"] })
      onCancel()
    },
    onError(error) {
      notifications.show({
        radius: "xs",
        color: "white",
        title: axios.isAxiosError(error) ? error.response?.data.message || "" : error.message,
        message: "",
        classNames: {
          title: "!text-white",
          description: "!text-white",
          root: "!bg-red-500",
        },
      })
    },
  })
  const handleUpdateCertificate = () => {
    mutate({ file: fileToUpload[0] })
  }

  return (
    <>
      <Modal centered opened={isOpen} onClose={close} title={t(`certificates.upload-modal.title`)}>
        <div>
          <Dropzone
            loading={isPending}
            multiple={false}
            onDrop={setFileToUpload}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}>
            <Group justify="center" gap="lg" p={"md"} mih={180} style={{ pointerEvents: "none" }}>
              <Dropzone.Accept>
                <Upload size={50} strokeWidth={1} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <X size={50} strokeWidth={1} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <ImageUp size={50} strokeWidth={1} />
              </Dropzone.Idle>

              <div className="text-center">
                <Text ta={"center"}>
                  <Trans
                    i18nKey="certificates.upload-modal.dropzone.title"
                    components={{ span: <span className="font-bold text-primary" /> }}
                  />
                </Text>
                <Text ta={"center"} size="sm" c="dimmed" inline mt={7}>
                  {t("certificates.upload-modal.dropzone.description")}
                </Text>
              </div>
            </Group>
          </Dropzone>
        </div>
        {fileToUpload.length > 0 ? <Alert>{fileToUpload[0].name}</Alert> : null}
        <Group justify="center" mt={"md"}>
          <Button
            onClick={handleUpdateCertificate}
            loading={isPending}
            disabled={fileToUpload.length <= 0}
            miw={"120px"}>
            {t("certificates.upload-modal.save")}
          </Button>
          <Button onClick={onCancel} miw={"120px"} variant="outline">
            {t("certificates.upload-modal.cancel")}
          </Button>
        </Group>
      </Modal>
      <Button size={sm ? "sm" : "md"} onClick={open} color="secondary">
        {t("certificates.download")}
      </Button>
    </>
  )
}

export default UploadModal
