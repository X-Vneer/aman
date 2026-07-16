import { ActionIcon, Button, Modal, SimpleGrid, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Awaerness } from "../@types"
import { DeleteAwareness } from "../delete-awareness"

type Props = Awaerness

const DeleteAwarenessComponent = ({ id, title }: Props) => {
  const [opened, { open, close }] = useDisclosure()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { mutate, isPending } = useMutation({
    mutationFn: DeleteAwareness,
    onSuccess() {
      close()
      queryClient.invalidateQueries({ queryKey: ["awareness"] })
    },
    onError() {
      notifications.show({
        color: "red",
        title: t("awareness.delete.failer.title"),
        message: t("awareness.delete.failer.message"),
      })
    },
  })
  return (
    <>
      <Modal opened={opened} onClose={close} centered withCloseButton>
        <Text>{t("awareness.delete.description", { value: title })}</Text>
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

export default DeleteAwarenessComponent
