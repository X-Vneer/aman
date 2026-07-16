import { Button, Modal, SimpleGrid, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { RotateCcw } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ResetAllUserVideos } from "../reset-user-videos"

const ResetAllUserVideosButton = () => {
  const [opened, { open, close }] = useDisclosure()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { mutate, isPending } = useMutation({
    mutationFn: ResetAllUserVideos,
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
        title={t("programs.reset.title-all")}>
        <Stack gap="sm">
          <Text fw={500}>{t("programs.reset.all-confirm")}</Text>
          <Text c="dimmed" size="sm">
            {t("programs.reset.description")}
          </Text>
        </Stack>
        <SimpleGrid cols={2} mt="md">
          <Button loading={isPending} onClick={() => mutate()} color="red">
            {t("programs.reset.ok")}
          </Button>
          <Button onClick={close} color="dark" variant="light" disabled={isPending}>
            {t("programs.reset.cancel")}
          </Button>
        </SimpleGrid>
      </Modal>
      <Button
        color="orange"
        variant="light"
        leftSection={<RotateCcw size={18} />}
        onClick={open}
        loading={isPending}>
        {t("programs.reset.button-all")}
      </Button>
    </>
  )
}

export default ResetAllUserVideosButton
