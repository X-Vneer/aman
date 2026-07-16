import { Video } from "@/@types/videos"
import { ActionIcon, Button, Modal, SimpleGrid, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { DeleteScene } from "../../delete-scene"
import { Scene } from "../../@types"
import { useParams } from "react-router-dom"

type Props = Scene

const DeleteSceneButton = ({ id }: Props) => {
  const [opened, { open, close }] = useDisclosure()
  const params = useParams() as { id: string }

  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { mutate, isPending } = useMutation({
    mutationFn: DeleteScene,
    onSuccess() {
      close()
      queryClient.invalidateQueries({ queryKey: ["programs", params.id] })
    },
    onError() {
      notifications.show({
        color: "red",
        title: t("programs.delete.failer.title"),
        message: t("programs.delete-scene.failer.message"),
      })
    },
  })
  return (
    <>
      <Modal opened={opened} onClose={close} centered withCloseButton>
        <Text>{t("programs.delete-scene.description")}</Text>
        <SimpleGrid cols={2} mt={"md"}>
          <Button loading={isPending} onClick={() => mutate({ id })} color="red">
            {t("programs.delete.yes")}
          </Button>
          <Button onClick={close} color="dark" variant="light">
            {t("programs.delete.cancel")}
          </Button>
        </SimpleGrid>
      </Modal>
      <ActionIcon loading={isPending} color="red" radius={"sm"} variant="subtle" onClick={open}>
        <Trash2 size={18} />
      </ActionIcon>
    </>
  )
}

export default DeleteSceneButton
