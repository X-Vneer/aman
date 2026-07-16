import { ActionIcon, Button, Modal, SimpleGrid, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Partner } from "../types"
import { DeletePartner } from "../delete-partner"

type Props = Partner

const DeletePartnerComponent = ({ id, name }: Props) => {
  const [opened, { open, close }] = useDisclosure()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { mutate, isPending } = useMutation({
    mutationFn: DeletePartner,
    onSuccess() {
      close()
      queryClient.invalidateQueries({ queryKey: ["partners"] })
    },
    onError() {
      notifications.show({
        color: "red",
        title: t("partners.delete.failer.title"),
        message: t("partners.delete.failer.message"),
      })
    },
  })
  return (
    <>
      <Modal opened={opened} onClose={close} centered withCloseButton>
        <Text>{t("partners.delete.description", { value: name })}</Text>
        <SimpleGrid cols={2} mt={"md"}>
          <Button loading={isPending} onClick={() => mutate({ id: id.toString() })} color="red">
            {t("partners.delete.yes")}
          </Button>
          <Button onClick={close} color="dark" variant="light">
            {t("partners.delete.cancel")}
          </Button>
        </SimpleGrid>
      </Modal>
      <ActionIcon loading={isPending} color="red" radius={"sm"} variant="subtle" onClick={open}>
        <Trash2 size={20} strokeWidth={1.6} />
      </ActionIcon>
    </>
  )
}

export default DeletePartnerComponent
