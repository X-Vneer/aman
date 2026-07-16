import RefreshButton from "@/components/common/refresh-button"
import SortableTh from "@/components/common/sortable-th"
import Error from "@/components/common/error"
import Loader from "@/components/common/loader"
import PaginationCom from "@/components/common/pagination"
import TableTotalCount from "@/components/common/table-total-count"
import useColors from "@/hooks/use-colors"
import { useSortParams } from "@/hooks/use-sort-params"
import { Link } from "@/lib/i18n/navigation"
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  HoverCard,
  Popover,
  Stack,
  Table,
  TableTh,
  TableThead,
  Text,
} from "@mantine/core"
import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronDown, MoreVertical, Trash2, User } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { DeleteUser } from "../delete-user"
import { GetUsers } from "../get-users"

const SORTABLE: Record<string, string> = {
  id: "id",
  name: "first_name",
  mobile: "mobile",
  certificate_count: "certificate_count",
  lang: "lang",
}
export const langs = {
  ar: {
    color: "green",
  },
  en: {
    color: "blue",
  },
  fr: {
    color: "red",
  },
  fil: {
    color: "gray",
  },
  id: {
    color: "pink",
  },
  ur: {
    color: "yellow",
  },
}

const TableCom = () => {
  const { t } = useTranslation()
  const { sortColumn, sortDirection, setSortState } = useSortParams()

  const searchParams = useOptimisticSearchParams()

  const { data, status, error, refetch, isFetching } = useQuery({
    queryKey: ["users", searchParams.toString()],
    queryFn: async () => await GetUsers(searchParams),
    // placeholderData: keepPreviousData,
  })

  // delete admin
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { isConfirmed } = await new Promise<{ isConfirmed: boolean }>((res) => {
        modals.openConfirmModal({
          title: t("users.delete.title"),
          centered: true,
          children: <Text size="sm">{t("users.delete.description")}</Text>,
          labels: { confirm: t("users.delete.confirm"), cancel: t("users.delete.cancel") },
          confirmProps: { color: "red" },
          onCancel: () => {
            res({ isConfirmed: false })
          },
          onConfirm: () => {
            res({ isConfirmed: true })
          },
        })
      })
      return isConfirmed ? await DeleteUser({ id }) : { isCanceled: true }
    },
    onSuccess(data, variables, context) {
      if (data.isCanceled) return
      queryClient.invalidateQueries({
        queryKey: ["users"],
      })
    },
    onError(error) {
      notifications.show({
        title: t("global.action-error-title"),
        color: "red",
        message: t("users.delete.error"),
      })
    },
  })
  const handleDeleteUser = (id: string) => {
    return () => {
      mutate({ id })
    }
  }
  const { data: colors } = useColors()
  if (status === "pending") return <Loader />

  return (
    <>
      <Group justify="space-between" align="center">
        {status === "success" ? <TableTotalCount meta={data.items.meta} /> : <span />}
        <RefreshButton refetch={refetch} isFetching={isFetching} />
      </Group>
      <Table.ScrollContainer minWidth={1060}>
        <Table
          highlightOnHover
          highlightOnHoverColor="#f6f6f6"
          className="overflow-hidden rounded-md bg-white">
          <TableThead>
            <Table.Tr>
              {(["id", "name", "mobile", "certificate_count", "program", "lang", "more"] as const).map((element) => {
                const sortKey = SORTABLE[element]
                return sortKey ? (
                  <SortableTh
                    key={element}
                    sortKey={sortKey}
                    label={t(`users.table.${element}`)}
                    currentSortColumn={sortColumn}
                    currentSortDirection={sortDirection}
                    onSort={setSortState}
                    className="!text-center"
                  />
                ) : (
                  <TableTh key={element} className="!text-center">
                    {t(`users.table.${element}`)}
                  </TableTh>
                )
              })}
            </Table.Tr>
          </TableThead>
          <Table.Tbody>
            {status === "error" ? <Error error={error} /> : null}
            {status === "success"
              ? data.items.data.map((user, index) => (
                  <Table.Tr key={user.id + "" + index}>
                    <Table.Td className="text-center">{user.id}</Table.Td>
                    <Table.Td className="text-center" fw={500} c={"black"}>
                      <Link className="underline" to={`/dashboard/users/${user.id}`}>
                        {user.full_name}
                      </Link>
                    </Table.Td>
                    <Table.Td className="text-center">{user.mobile}</Table.Td>
                    <Table.Td className="text-center">
                      <span className="!block !text-center">{user.certificate_count}</span>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <>
                        {user.userVideos.length < 1 ? (
                          <Badge key={user.id} color={"dark"}>
                            {t("not-completed")}
                          </Badge>
                        ) : user.userVideos.length <= 1 ? (
                          user.userVideos.map((video) => {
                            return (
                              <Badge key={video.video_id} color={colors?.[video.video_id]}>
                                {video.video_title}
                              </Badge>
                            )
                          })
                        ) : (
                          <HoverCard width={200} shadow="md">
                            <HoverCard.Target>
                              <Badge
                                rightSection={<ChevronDown size={19} className="text-black" />}
                                key={user.userVideos[0]?.video_id}
                                color={colors?.[user.userVideos[0]?.video_id]}>
                                {user.userVideos[0]?.video_title}
                              </Badge>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                              <Stack gap={"xs"}>
                                {user.userVideos
                                  ? user.userVideos.map((video) => {
                                      return (
                                        <Badge
                                          key={video.video_id}
                                          color={colors?.[video.video_id]}
                                          // rightSection={
                                          //   <Box
                                          //     bg={VIDEO_COLORS[Number(user.video_id)]}
                                          //     className="size-1.5 rounded-full"></Box>
                                          // }
                                        >
                                          {video.video_title}
                                        </Badge>
                                      )
                                    })
                                  : t("not-completed")}
                              </Stack>
                            </HoverCard.Dropdown>
                          </HoverCard>
                        )}
                      </>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Badge
                        color={langs[user.lang].color}
                        rightSection={
                          <Box bg={langs[user.lang].color} className="size-1.5 rounded-full"></Box>
                        }>
                        {t(`langs.${user.lang}`)}
                      </Badge>
                    </Table.Td>

                    <Table.Td className="text-center">
                      <Popover width={170} shadow="lg" position="left-start">
                        <Popover.Target>
                          <ActionIcon variant="subtle" color="gray" aria-label="Settings">
                            <MoreVertical />
                          </ActionIcon>
                        </Popover.Target>
                        <Popover.Dropdown className="!border-none" p="xs">
                          <Stack gap={"xs"}>
                            <Button
                              variant="subtle"
                              size="sm"
                              component={Link}
                              to={`/dashboard/users/${user.id}`}
                              color="black"
                              justify="start"
                              leftSection={<User size={20} />}>
                              {t("global.details")}
                            </Button>
                            <Button
                              onClick={handleDeleteUser(user.id)}
                              color="red"
                              variant="subtle"
                              size="sm"
                              justify="start"
                              leftSection={<Trash2 size={20} />}>
                              {t("global.delete")}
                            </Button>
                          </Stack>
                        </Popover.Dropdown>
                      </Popover>
                    </Table.Td>
                  </Table.Tr>
                ))
              : null}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <PaginationCom last_page={data?.items.meta.last_page} />
    </>
  )
}

export default TableCom
