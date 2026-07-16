import { ActionIcon, Group, Radio, ScrollArea, Stack, Text, Space } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useSmallScreen } from "@/hooks/use-small-screen"
import { useViewportSize } from "@mantine/hooks"
import { modals } from "@mantine/modals"
import { Search, Trash2 } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useTranslation } from "react-i18next"
import { DeleteAdmin } from "../delete-admin"
import { AdminsResponse } from "../type"
import { notifications } from "@mantine/notifications"
import SearchInput from "@/components/ui/search-input"
const ListAdmins = ({ data }: { data: AdminsResponse["data"] }) => {
  const { t } = useTranslation()

  const [selected, setSelected] = useQueryState("selected", parseAsString.withDefault(""))
  const { height } = useViewportSize()
  const sm = useSmallScreen()

  // delete admin
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { isConfirmed } = await new Promise<{ isConfirmed: boolean }>((res) => {
        modals.openConfirmModal({
          title: t("permissions.delete.title"),
          centered: true,
          children: <Text size="sm">{t("permissions.delete.description")}</Text>,
          labels: { confirm: t("permissions.delete.confirm"), cancel: t("permissions.delete.cancel") },
          confirmProps: { color: "red" },
          onCancel: () => {
            res({ isConfirmed: false })
          },
          onConfirm: () => {
            res({ isConfirmed: true })
          },
        })
      })
      return isConfirmed ? await DeleteAdmin({ id }) : { isCanceled: true }
    },
    onSuccess(data, variables, context) {
      if (data.isCanceled) return
      queryClient.invalidateQueries({
        queryKey: ["admins"],
      })
    },
    onError(error) {
      notifications.show({
        title: t("global.action-error-title"),
        color: "red",
        message: t("permissions.delete.error"),
      })
    },
  })
  const handleDeleteAdmin = (id: string) => {
    return () => {
      mutate({ id })
    }
  }

  return (
    <Radio.Group value={selected} onChange={setSelected}>
      <ScrollArea h={sm ? "30vh" : height - 190}>
        <Stack>
          <Space />
          <SearchInput maw={undefined} />
          {data.items.data.map((user) => {
            return (
              <Radio.Card
                className="group !h-11 !border-transparent !bg-white !px-2 !py-1 duration-300 data-checked:!border-gray-200 data-checked:!border-secondary data-checked:!bg-[#F6F6F6] data-checked:text-secondary"
                key={user.id}
                value={user.id}
                radius="md">
                <Group wrap="nowrap" justify="space-between">
                  <Text lineClamp={1}>{user.name || " unknown"}</Text>
                  <ActionIcon
                    onClick={handleDeleteAdmin(user.id)}
                    className="!hidden group-data-checked:!block"
                    radius={"md"}
                    variant="subtle"
                    color="secondary"
                    size="lg">
                    <Trash2 />
                  </ActionIcon>
                </Group>
              </Radio.Card>
            )
          })}
        </Stack>
      </ScrollArea>
    </Radio.Group>
  )
}

export default ListAdmins
