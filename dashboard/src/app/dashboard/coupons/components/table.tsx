import RefreshButton from "@/components/common/refresh-button"
import SortableTh from "@/components/common/sortable-th"
import Error from "@/components/common/error"
import Loader from "@/components/common/loader"
import PaginationCom from "@/components/common/pagination"
import TableTotalCount from "@/components/common/table-total-count"
import { useSortParams } from "@/hooks/use-sort-params"
import { Link } from "@/lib/i18n/navigation"
import { ActionIcon, Badge, Box, Button, Group, Popover, Stack, Table, TableTh, TableThead } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { ChartNoAxesCombined, MoreVertical, Pen } from "lucide-react"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"
import { GetCoupons } from "../get-coupons"
import ToggleActivity from "./toggle-activity"

const SORTABLE: Record<string, string> = {
  name: "name",
  code: "code",
  discount: "amount",
  "used-by": "uses_count",
  "start-date": "date_start",
  "end-date": "date_end",
  status: "status",
}
export const couponStatus = {
  Active: {
    label: "active",
    color: "green",
  },
  Inactive: {
    label: "inactive",
    color: "blue",
  },
  Expired: {
    label: "expired",
    color: "red",
  },
}
const TableCom = () => {
  const { t } = useTranslation()
  const { sortColumn, sortDirection, setSortState } = useSortParams()

  const searchParams = useOptimisticSearchParams()

  const { data, error, status, refetch, isFetching } = useQuery({
    queryKey: ["coupons", searchParams.toString()],
    queryFn: async () => await GetCoupons(searchParams),
  })

  if (status === "pending") return <Loader />

  return (
    <>
      <Group justify="space-between" align="center">
        {status === "success" ? <TableTotalCount meta={data.items.meta} /> : <span />}
        <RefreshButton refetch={refetch} isFetching={isFetching} />
      </Group>
      <Table.ScrollContainer minWidth={1100}>
        <Table
          highlightOnHover
          highlightOnHoverColor="#f6f6f6"
          className="overflow-hidden rounded-md bg-white">
          <TableThead>
            <Table.Tr>
              {(["name", "code", "discount", "used-by", "start-date", "end-date", "status", "is-active", "more"] as const).map((element) => {
                const sortKey = SORTABLE[element]
                return sortKey ? (
                  <SortableTh
                    key={element}
                    sortKey={sortKey}
                    label={t(`coupons.table.${element}`)}
                    currentSortColumn={sortColumn}
                    currentSortDirection={sortDirection}
                    onSort={setSortState}
                    className="!text-center"
                    info={element === "used-by" ? t("coupons.table.used-by-info") : undefined}
                  />
                ) : (
                  <TableTh key={element} className="!text-center">
                    {t(`coupons.table.${element}`)}
                  </TableTh>
                )
              })}
            </Table.Tr>
          </TableThead>
          <Table.Tbody>
            {status === "error" ? <Error error={error} /> : null}
            {status === "success"
              ? data.items.data.map((coupon) => (
                  <Table.Tr key={coupon.id}>
                    <Table.Td className="text-center">{coupon.name}</Table.Td>
                    <Table.Td className="text-center">{coupon.code}</Table.Td>
                    <Table.Td className="text-center">
                      {coupon.amount || coupon.discount_amount} {coupon.type === "Percentage" ? "%" : ""}
                    </Table.Td>
                    <Table.Td className="text-center">{coupon.number_of_users}</Table.Td>
                    <Table.Td className="text-center">
                      {dayjs(coupon.date_start).format("DD/MM/YYYY")}
                    </Table.Td>
                    <Table.Td className="text-center">{dayjs(coupon.date_end).format("DD/MM/YYYY")}</Table.Td>
                    <Table.Td className="text-center">
                      <Badge
                        color={couponStatus[coupon.status as keyof typeof couponStatus].color}
                        rightSection={
                          <Box
                            bg={couponStatus[coupon.status as keyof typeof couponStatus].color}
                            className="size-1.5 rounded-full"></Box>
                        }>
                        {t(
                          `coupons.table.status-label.${couponStatus[coupon.status as keyof typeof couponStatus].label as "active"}`,
                        )}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="flex justify-center text-center">
                      {coupon.status === "Expired" || new Date(coupon.date_start) > new Date() ? null : (
                        <ToggleActivity coupon={coupon} />
                      )}
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
                            {/* <Button
                          variant="subtle"
                          size="sm"
                          component={Link}
                          to={`/dashboard/coupons/${coupon.id}`}
                          color="black"
                          justify="start"
                          leftSection={<User size={20} />}>
                          {t("global.details")}
                        </Button> */}
                            <Button
                              variant="subtle"
                              size="sm"
                              color="black"
                              component={Link}
                              to={`/dashboard/coupons/${coupon.id}`}
                              justify="start"
                              leftSection={<ChartNoAxesCombined size={20} />}>
                              {t("global.reports")}
                            </Button>
                            <Button
                              variant="subtle"
                              size="sm"
                              color="black"
                              component={Link}
                              to={`/dashboard/coupons/${coupon.id}/edit`}
                              justify="start"
                              leftSection={<Pen size={20} />}>
                              {t("global.edit")}
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
