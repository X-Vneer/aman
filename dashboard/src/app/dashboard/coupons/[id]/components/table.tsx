import Error from "@/components/common/error"
import Loader from "@/components/common/loader"
import PaginationCom from "@/components/common/pagination"
import RefreshButton from "@/components/common/refresh-button"
import SortableTh from "@/components/common/sortable-th"
import TableTotalCount from "@/components/common/table-total-count"
import type { SortDirection } from "@/hooks/use-sort-params"
import { Group, Table, TableTh, TableThead } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import ExportButton from "@/components/common/export-button"
import SearchInput from "@/components/ui/search-input"
import { useParams } from "@/lib/i18n/navigation"
import dayjs from "dayjs"
import { parseAsString, useQueryStates } from "nuqs"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { GetUsers } from "../get-users"

const SORTABLE: Record<string, string> = {
  name: "user_name",
  mobile: "user_mobile",
  video_title: "video_title",
  number_of_time_used: "number_of_time_used",
  percentage: "percentage",
  price: "price",
  date: "created_at",
}

const tableHead = ["name", "mobile", "video_title", "number_of_time_used", "percentage", "price", "date"] as const

const UsersTable = () => {
  const { t } = useTranslation()
  const { id } = useParams() as { id: string }

  const searchParams = useOptimisticSearchParams()

  // Prefixed sort params to avoid collision with graph/detail filters on the same URL
  const [sort, setSort] = useQueryStates({
    users_sort_column: parseAsString,
    users_sort_direction: parseAsString,
  })
  const sortColumn = sort.users_sort_column ?? null
  const sortDirection = (sort.users_sort_direction as SortDirection) ?? null

  const setSortState = (column: string | null, direction: SortDirection | null) => {
    setSort({ users_sort_column: column, users_sort_direction: direction })
  }

  // Build API params: copy all current URL params but translate prefixed sort keys
  const apiParams = new URLSearchParams(searchParams.toString())
  apiParams.delete("users_sort_column")
  apiParams.delete("users_sort_direction")
  if (sortColumn) apiParams.set("sort_column", sortColumn)
  if (sortDirection) apiParams.set("sort_direction", sortDirection)

  const { data, status, error, refetch, isFetching } = useQuery({
    queryKey: ["coupon", id, "users", searchParams.toString()],
    queryFn: async () => await GetUsers(id, apiParams),
  })

  if (status === "pending") return <Loader />

  return (
    <>
      <Group justify="space-between" gap={"lg"} wrap="nowrap">
        <SearchInput />
        <Group wrap="nowrap">
          <RefreshButton refetch={refetch} isFetching={isFetching} />
          <ExportButton queryFun={(q) => GetUsers(id, q)} filename="users" />
        </Group>
      </Group>

      <Group justify="space-between" align="center">
        {status === "success" ? <TableTotalCount meta={data.items.meta} /> : <span />}
      </Group>
      <Table.ScrollContainer minWidth={800}>
        <Table
          highlightOnHover
          highlightOnHoverColor="#f6f6f6"
          className="overflow-hidden rounded-md bg-white">
          <TableThead>
            <Table.Tr>
              {tableHead.map((element) => {
                const sortKey = SORTABLE[element]
                if (sortKey) {
                  return (
                    <SortableTh
                      key={element}
                      sortKey={sortKey}
                      label={t(`coupons.view.table.${element}`)}
                      currentSortColumn={sortColumn}
                      currentSortDirection={sortDirection}
                      onSort={setSortState}
                      className="!text-center"
                    />
                  )
                }
                return (
                  <TableTh key={element} className="!text-center">
                    {t(`coupons.view.table.${element}`)}
                  </TableTh>
                )
              })}
              <TableTh></TableTh>
            </Table.Tr>
          </TableThead>
          <Table.Tbody>
            {status === "error" ? <Error error={error} /> : null}
            {status === "success"
              ? data.items.data.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td className="text-center">{user.user.full_name}</Table.Td>
                    <Table.Td className="text-center">{user.user.mobile}</Table.Td>
                    <Table.Td className="text-center">{user.video_title}</Table.Td>

                    <Table.Td className="text-center">{user.number_of_time_used}</Table.Td>
                    <Table.Td className="text-center">{user.percentage}</Table.Td>
                    <Table.Td className="text-center">{user.price}</Table.Td>

                    <Table.Td className="text-center">
                      {dayjs(new Date(user.created_at)).format("DD/MM/YYYY")}
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

export default UsersTable
