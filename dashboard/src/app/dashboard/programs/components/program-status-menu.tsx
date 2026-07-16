import { ActionIcon, Menu } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { MoreVertical } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Video } from "@/@types/videos"
import { putVideoStatus, type ProgramStatusValue } from "../update-video-status"
import ResetUserVideosMenuItem from "./reset-user-videos-button"

type Props = Video

const ProgramStatusMenu = (video: Props) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const filter = { queryKey: ["programs"] }

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProgramStatusValue }) => putVideoStatus({ id, status }),
    onSuccess() {
      queryClient.invalidateQueries(filter)
    },
    onError(error: Error) {
      queryClient.invalidateQueries(filter)
      notifications.show({
        radius: "xs",
        color: "white",
        title: t("programs.status-menu-error"),
        message:
          axios.isAxiosError(error) && error.response?.data?.message
            ? String(error.response.data.message)
            : error.message,
        classNames: {
          title: "!text-white",
          description: "!text-white",
          root: "!bg-red-500",
        },
      })
    },
  })

  const setStatus = (status: ProgramStatusValue) => {
    mutate({ id: video.id, status })
  }

  return (
    <Menu shadow="md" width={200} position="bottom-end" withinPortal>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray" aria-label={t("programs.status-menu-aria")} loading={isPending}>
          <MoreVertical size={18} strokeWidth={1.5} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{t("programs.status-menu-title")}</Menu.Label>
        <Menu.Item onClick={() => setStatus("New")}>{t("programs.status-new")}</Menu.Item>
        <Menu.Item onClick={() => setStatus("Updated")}>{t("programs.status-updated")}</Menu.Item>
        <Menu.Divider />
        <Menu.Item color="dimmed" onClick={() => setStatus(null)}>
          {t("programs.status-clear")}
        </Menu.Item>
        <Menu.Divider />
        <ResetUserVideosMenuItem {...video} />
      </Menu.Dropdown>
    </Menu>
  )
}

export default ProgramStatusMenu
