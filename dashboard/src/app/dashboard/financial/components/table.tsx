import RefreshButton from "@/components/common/refresh-button"
import SortableTh from "@/components/common/sortable-th"
import Error from "@/components/common/error"
import Loader from "@/components/common/loader"
import PaginationCom from "@/components/common/pagination"
import TableTotalCount from "@/components/common/table-total-count"
import { useSortParams } from "@/hooks/use-sort-params"
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Menu,
  Table,
  TableTh,
  TableThead,
  Tooltip,
} from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import useColors from "@/hooks/use-colors"
import { Link } from "@/lib/i18n/navigation"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/ar"
import "dayjs/locale/en"

dayjs.extend(relativeTime)
import { Eye, MoreVertical, Receipt } from "lucide-react"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useState } from "react"
import { type UserInfo as UserInfoType } from "../../types"
import { GetUsersInfo } from "../get-financial"
import ResetUserVideoMenuItem from "./reset-user-video-menu-item"
import TransactionDetailsModal from "./transaction-details-modal"
import UserInfo from "./user-info"
const tableHead = [
  "id",
  "name",
  "program",
  "transaction",
  "order_id",
  "coupon_code",
  "payment_method",
  "price",
  "discount_value",
  "tax_value",
  "paid",
  "transaction_date",
] as const

const SORTABLE: Record<(typeof tableHead)[number], string> = {
  id: "id",
  name: "user_name",
  program: "program",
  transaction: "status",
  order_id: "order_id",
  coupon_code: "coupon_code",
  payment_method: "payment_method",
  price: "price",
  discount_value: "discount_value",
  tax_value: "tax_value",
  paid: "paid",
  transaction_date: "created_at",
}

const UsersTable = () => {
  // const {data,isloading,isError} = useQuery
  const { t, i18n } = useTranslation()
  const dayjsLocale = i18n.language === "ar" ? "ar" : "en"
  dayjs.locale(dayjsLocale)

  const searchParams = useOptimisticSearchParams()

  const { sortColumn, sortDirection, setSortState } = useSortParams()

  const { data, status, error, refetch, isFetching } = useQuery({
    queryKey: ["financial", "users", searchParams.toString()],
    queryFn: async () => await GetUsersInfo(searchParams),
    // placeholderData: keepPreviousData,
  })

  const user = useState<UserInfoType | null>(null)
  const transactionDetails = useState<string | number | null>(null)
  const handleShowUserInfo = (value: UserInfoType) => {
    const [_, setUser] = user
    setUser(value)
  }
  const handleShowTransactionDetails = (transactionIdOrOrderId: number | string) => {
    const [_, setTransactionDetails] = transactionDetails
    setTransactionDetails(transactionIdOrOrderId)
  }
  const { data: colors } = useColors()
  if (status === "pending") return <Loader />

  return (
    <>
      <Group justify="space-between" align="center">
        {status === "success" ? <TableTotalCount meta={data.items.meta} /> : <span />}
        <RefreshButton refetch={refetch} isFetching={isFetching} />
      </Group>
      <Table.ScrollContainer minWidth={1200}>
        <Table
          highlightOnHover
          highlightOnHoverColor="#f6f6f6"
          className="overflow-hidden rounded-md bg-white">
          <TableThead>
            <Table.Tr>
              {tableHead.map((element) => (
                <SortableTh
                  key={element}
                  sortKey={SORTABLE[element]}
                  label={t(`financial.users.table.${element}` as never)}
                  currentSortColumn={sortColumn}
                  currentSortDirection={sortDirection}
                  onSort={setSortState}
                  className="!text-center"
                />
              ))}
              <TableTh></TableTh>
            </Table.Tr>
          </TableThead>
          <Table.Tbody>
            {status === "error" ? <Error error={error} /> : null}
            {status === "success"
              ? data.items.data.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td className="text-center">{user.id}</Table.Td>
                    <Table.Td className="text-center" fw={600} c="black">
                      <Link className="underline" to={`/dashboard/users/${user.user.id}`}>
                        {user.name}
                      </Link>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Badge color={colors?.[user.video_id]}>{user.program}</Badge>
                    </Table.Td>
                    <Table.Td className="text-center">
                      {user.transaction.payment_status && (
                        <Badge
                          color={
                            user.transaction.payment_status === "Accepted"
                              ? "green"
                              : user.transaction.payment_status === "UnderReview"
                                ? "orange"
                                : "red"
                          }
                          rightSection={
                            <Box
                              bg={
                                user.transaction.payment_status === "Accepted"
                                  ? "green"
                                  : user.transaction.payment_status === "UnderReview"
                                    ? "orange"
                                    : "red"
                              }
                              className="size-1.5 rounded-full"></Box>
                          }>
                          {t(
                            `home.users.table.transaction-status.${user.transaction.payment_status?.toLowerCase() as "accepted"}`,
                          )}
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td className="text-center">{user.transaction.order_id || "-"}</Table.Td>
                    <Table.Td className="text-center">{user.coupon_code}</Table.Td>
                    <Table.Td className="text-center">{user.transaction.payment_method}</Table.Td>
                    <Table.Td className="text-center">{user.price}</Table.Td>
                    <Table.Td className="text-center">{user.discount_value}</Table.Td>
                    <Table.Td className="text-center">{user.tax_value}</Table.Td>
                    <Table.Td className="text-center">{user.paid}</Table.Td>

                    <Table.Td className="text-center">
                      <Tooltip
                        label={dayjs(user.transaction.transaction_date).format(
                          "DD/MM/YYYY HH:mm",
                        )}
                        withArrow>
                        <span className="cursor-default">
                          {dayjs(user.transaction.transaction_date).fromNow()}
                        </span>
                      </Tooltip>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Menu width={200} shadow="lg" position="left-start">
                        <Menu.Target>
                          <ActionIcon
                            radius={"sm"}
                            size={"lg"}
                            variant="subtle"
                            color="gray"
                            aria-label="Actions">
                            <MoreVertical />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown className="!border-none" p="xs">
                          <Menu.Item
                            className="text-sm"
                            leftSection={<Eye size={20} />}
                            onClick={() => {
                              handleShowUserInfo(user)
                            }}>
                            {t("global.details", "Details")}
                          </Menu.Item>
                          {user.transaction.order_id && (
                            <Menu.Item
                              className="text-sm"
                              leftSection={<Receipt size={20} />}
                              onClick={() => {
                                const identifier = user.transaction.id || user.transaction.order_id
                                if (identifier) {
                                  handleShowTransactionDetails(identifier)
                                }
                              }}>
                              {t("financial.transaction-details.history", "Transaction History")}
                            </Menu.Item>
                          )}
                          {user.transaction.payment_status === "Accepted" && (
                            <ResetUserVideoMenuItem
                              userVideoId={user.id}
                              userName={user.name}
                              programName={user.program}
                            />
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))
              : null}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <UserInfo userState={user} />
      <TransactionDetailsModal
        transactionId={transactionDetails[0]}
        onClose={() => {
          const [_, setTransactionDetails] = transactionDetails
          setTransactionDetails(null)
        }}
      />
      <PaginationCom last_page={data?.items.meta.last_page} />
    </>
  )
}

export default UsersTable
