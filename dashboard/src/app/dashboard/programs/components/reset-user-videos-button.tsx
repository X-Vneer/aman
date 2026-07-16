import { Video } from "@/@types/videos"
import { Button, Menu, Modal, SimpleGrid, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { RotateCcw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ResetUserVideosByVideo } from "../reset-user-videos"

type Props = Video

const ResetUserVideosMenuItem = ({ id, title }: Props) => {
  const [opened, { open, close }] = useDisclosure()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { mutate, isPending } = useMutation({
    mutationFn: ResetUserVideosByVideo,
    onSuccess(data) {
      close()
      queryClient.invalidateQueries({ queryKey: ["programs"] })
      notifications.show({
        color: "teal",
        title: t("programs.reset.success.title"),
        message: t("programs.reset.success.message", { count: data.affected }),
      })
    },
    onError(error) {
      notifications.show({
        color: "red",
        title: t("programs.reset.failure.title"),
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
        title={t("programs.reset.title")}>
        <Stack gap="sm">
          <Text fw={500}>{t("programs.reset.video-confirm", { value: title })}</Text>
          <Text c="dimmed" size="sm">
            {t("programs.reset.description")}
          </Text>
        </Stack>
        <SimpleGrid cols={2} mt="md">
          <Button loading={isPending} onClick={() => mutate({ id })} color="red">
            {t("programs.reset.ok")}
          </Button>
          <Button onClick={close} color="dark" variant="light" disabled={isPending}>
            {t("programs.reset.cancel")}
          </Button>
        </SimpleGrid>
      </Modal>
      <Menu.Item
        leftSection={<RotateCcw size={16} />}
        color="orange"
        disabled={isPending}
        onClick={open}
        closeMenuOnClick={false}>
        {t("programs.reset.title")}
      </Menu.Item>
    </>
  )
}

export default ResetUserVideosMenuItem
