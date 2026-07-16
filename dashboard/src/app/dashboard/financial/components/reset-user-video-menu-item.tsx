import { Button, Menu, Modal, SimpleGrid, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { RotateCcw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ResetUserVideo } from "../reset-user-video"

type Props = {
  userVideoId: string
  userName: string
  programName: string
}

const ResetUserVideoMenuItem = ({ userVideoId, userName, programName }: Props) => {
  const [opened, { open, close }] = useDisclosure()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const { mutate, isPending } = useMutation({
    mutationFn: ResetUserVideo,
    onSuccess() {
      close()
      queryClient.invalidateQueries({ queryKey: ["financial"] })
      notifications.show({
        color: "teal",
        title: t("financial.reset-user-video.success.title"),
        message: t("financial.reset-user-video.success.message"),
      })
    },
    onError(error) {
      notifications.show({
        color: "red",
        title: t("financial.reset-user-video.failure.title"),
        message:
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : error.message,
      })
    },
  })

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton
        title={t("financial.reset-user-video.title")}>
        <Stack gap="sm">
          <Text fw={500}>
            {t("financial.reset-user-video.confirm", { user: userName, program: programName })}
          </Text>
          <Text c="dimmed" size="sm">
            {t("financial.reset-user-video.description")}
          </Text>
        </Stack>
        <SimpleGrid cols={2} mt="md">
          <Button loading={isPending} onClick={() => mutate({ id: userVideoId })} color="red">
            {t("financial.reset-user-video.ok")}
          </Button>
          <Button onClick={close} color="dark" variant="light" disabled={isPending}>
            {t("financial.reset-user-video.cancel")}
          </Button>
        </SimpleGrid>
      </Modal>
      <Menu.Item
        className="text-sm"
        leftSection={<RotateCcw size={20} />}
        color="orange"
        disabled={isPending}
        onClick={open}
        closeMenuOnClick={false}>
        {t("financial.reset-user-video.title")}
      </Menu.Item>
    </>
  )
}

export default ResetUserVideoMenuItem
