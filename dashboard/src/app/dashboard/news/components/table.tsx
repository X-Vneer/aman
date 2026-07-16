import RefreshButton from "@/components/common/refresh-button"
import SortableTh from "@/components/common/sortable-th"
import Error from "@/components/common/error"
import Loader from "@/components/common/loader"
import PaginationCom from "@/components/common/pagination"
import TableTotalCount from "@/components/common/table-total-count"
import { useSortParams } from "@/hooks/use-sort-params"
import { Link } from "@/lib/i18n/navigation"
import { ActionIcon, Group, HoverCard, Table, TableTh, TableThead, Text } from "@mantine/core"
import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import "dayjs/locale/ar"
import { SquarePen, Trash2 } from "lucide-react"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { DeleteNews } from "../delete-news"
import { GetNewsList } from "../get-news-list"
import { NewsItem } from "../types"

const tableHead = ["title", "publish_date", "actions"] as const
const SORTABLE: Record<string, string> = { publish_date: "publish_date" }

function newsTitle(item: NewsItem, lang: string) {
  const t = item.title
  if (typeof t === "string") return t
  const key = lang in t ? (lang as keyof typeof t) : "en"
  return t[key] || t.ar || t.en || Object.values(t).find(Boolean) || "—"
}

const TableCom = () => {
  const { t, i18n } = useTranslation()
  const searchParams = useOptimisticSearchParams()
  const queryClient = useQueryClient()

  useEffect(() => {
    dayjs.locale(i18n.language === "ar" ? "ar" : "en")
  }, [i18n.language])

  const { sortColumn, sortDirection, setSortState } = useSortParams()

  const { data, status, error, refetch, isFetching } = useQuery({
    queryKey: ["news", searchParams.toString()],
    queryFn: async () => await GetNewsList(searchParams),
  })

  const { mutate } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { isConfirmed } = await new Promise<{ isConfirmed: boolean }>((res) => {
        modals.openConfirmModal({
          title: t("news.delete.title"),
          centered: true,
          children: <Text size="sm">{t("news.delete.description")}</Text>,
          labels: { confirm: t("news.delete.confirm"), cancel: t("news.delete.cancel") },
          confirmProps: { color: "red" },
          onCancel: () => {
            res({ isConfirmed: false })
          },
          onConfirm: () => {
            res({ isConfirmed: true })
          },
        })
      })
      return isConfirmed ? await DeleteNews({ id }) : { isCanceled: true }
    },
    onSuccess(data) {
      if ("isCanceled" in data && data.isCanceled) return
      queryClient.invalidateQueries({ queryKey: ["news"] })
    },
    onError() {
      notifications.show({
        title: t("global.action-error-title"),
        color: "red",
        message: t("news.delete.error"),
      })
    },
  })

  const handleDelete = (id: string) => () => {
    mutate({ id })
  }

  if (status === "pending") return <Loader />

  return (
    <>
      <Group justify="space-between" align="center">
        {status === "success" ? <TableTotalCount meta={data.items.meta} /> : <span />}
        <RefreshButton refetch={refetch} isFetching={isFetching} />
      </Group>
      <Table.ScrollContainer minWidth={520}>
        <Table
          highlightOnHover
          highlightOnHoverColor="#f6f6f6"
          className="overflow-hidden rounded-md bg-white">
          <TableThead>
            <Table.Tr>
              {tableHead.map((element) => {
                const sortKey = SORTABLE[element]
                return sortKey ? (
                  <SortableTh
                    key={element}
                    sortKey={sortKey}
                    label={t(`news.table.${element}`)}
                    currentSortColumn={sortColumn}
                    currentSortDirection={sortDirection}
                    onSort={setSortState}
                    className="!text-center"
                  />
                ) : (
                  <TableTh key={element} className="!text-center">
                    {t(`news.table.${element}`)}
                  </TableTh>
                )
              })}
            </Table.Tr>
          </TableThead>
          <Table.Tbody>
            {status === "error" ? <Error error={error} /> : null}
            {status === "success"
              ? data.items.data.map((item) => (
                  <Table.Tr key={item.id}>
                    <Table.Td maw={360}>
                      <HoverCard width={320} shadow="md">
                        <HoverCard.Target>
                          <Text size="sm" truncate="end" fw={500} c="black">
                            {newsTitle(item, i18n.language)}
                          </Text>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm">{newsTitle(item, i18n.language)}</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Table.Td>
                    <Table.Td className="text-center">
                      {item.publish_date
                        ? dayjs(item.publish_date).format("DD MMM YYYY")
                        : "—"}
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Group justify="center" gap="xs" wrap="nowrap">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          component={Link}
                          to={`/dashboard/news/${item.id}`}
                          aria-label={t("global.edit")}>
                          <SquarePen size={18} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={handleDelete(item.id)}
                          aria-label={t("global.delete")}>
                          <Trash2 size={18} />
                        </ActionIcon>
                      </Group>
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
