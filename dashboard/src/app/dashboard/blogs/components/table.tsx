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
import { DeleteBlog } from "../delete-blog"
import { GetBlogs } from "../get-blogs"
import { Blog } from "../types"

const tableHead = ["title", "publish_date", "actions"] as const
const SORTABLE: Record<string, string> = { publish_date: "publish_date" }

function blogTitle(blog: Blog, lang: string) {
  const t = blog.title
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
    queryKey: ["blogs", searchParams.toString()],
    queryFn: async () => await GetBlogs(searchParams),
  })

  const { mutate } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { isConfirmed } = await new Promise<{ isConfirmed: boolean }>((res) => {
        modals.openConfirmModal({
          title: t("blogs.delete.title"),
          centered: true,
          children: <Text size="sm">{t("blogs.delete.description")}</Text>,
          labels: { confirm: t("blogs.delete.confirm"), cancel: t("blogs.delete.cancel") },
          confirmProps: { color: "red" },
          onCancel: () => {
            res({ isConfirmed: false })
          },
          onConfirm: () => {
            res({ isConfirmed: true })
          },
        })
      })
      return isConfirmed ? await DeleteBlog({ id }) : { isCanceled: true }
    },
    onSuccess(data) {
      if ("isCanceled" in data && data.isCanceled) return
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
    },
    onError() {
      notifications.show({
        title: t("global.action-error-title"),
        color: "red",
        message: t("blogs.delete.error"),
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
                    label={t(`blogs.table.${element}`)}
                    currentSortColumn={sortColumn}
                    currentSortDirection={sortDirection}
                    onSort={setSortState}
                    className="!text-center"
                  />
                ) : (
                  <TableTh key={element} className="!text-center">
                    {t(`blogs.table.${element}`)}
                  </TableTh>
                )
              })}
            </Table.Tr>
          </TableThead>
          <Table.Tbody>
            {status === "error" ? <Error error={error} /> : null}
            {status === "success"
              ? data.items.data.map((blog) => (
                  <Table.Tr key={blog.id}>
                    <Table.Td maw={360}>
                      <HoverCard width={320} shadow="md">
                        <HoverCard.Target>
                          <Text size="sm" truncate="end" fw={500} c="black">
                            {blogTitle(blog, i18n.language)}
                          </Text>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm">{blogTitle(blog, i18n.language)}</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Table.Td>
                    <Table.Td className="text-center">
                      {blog.publish_date
                        ? dayjs(blog.publish_date).format("DD MMM YYYY")
                        : "—"}
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Group justify="center" gap="xs" wrap="nowrap">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          component={Link}
                          to={`/dashboard/blogs/${blog.id}`}
                          aria-label={t("global.edit")}>
                          <SquarePen size={18} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={handleDelete(blog.id)}
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
