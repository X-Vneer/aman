import Error from "@/components/common/error"
import Loader from "@/components/common/loader"
import PaginationCom from "@/components/common/pagination"
import TableTotalCount from "@/components/common/table-total-count"
import { Badge, Box, Table, TableTh, TableThead } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import useColors from "@/hooks/use-colors"
import { Link } from "@/lib/i18n/navigation"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { GetUsersInfo } from "../get-users"
const tableHead = ["id", "name", "program", "transaction"] as const

const UsersTable = () => {
  // const {data,isloading,isError} = useQuery
  const { t } = useTranslation()

  const searchParams = useOptimisticSearchParams()

  const { data, status, error } = useQuery({
    queryKey: ["home", "users", searchParams.toString()],
    queryFn: async () => await GetUsersInfo(searchParams),
    // placeholderData: keepPreviousData,
  })
  const { data: colors } = useColors()
  if (status === "pending") return <Loader />

  return (
    <>
      {status === "success" ? <TableTotalCount meta={data.items.meta} /> : null}
      <Table.ScrollContainer minWidth={800}>
        <Table
          highlightOnHover
          highlightOnHoverColor="#f6f6f6"
          className="overflow-hidden rounded-md bg-white">
          <TableThead>
            <Table.Tr>
              {tableHead.map((element) => {
                return (
                  <TableTh key={element} className="!text-center">
                    {t(`home.users.table.${element}`)}
                  </TableTh>
                )
              })}
              {import.meta.env.REACT_APP_TEST == true && (
                <>
                  <TableTh>created at</TableTh>
                  <TableTh>updated at</TableTh>
                </>
              )}
            </Table.Tr>
          </TableThead>
          <Table.Tbody>
            {status === "error" ? <Error error={error} /> : null}
            {status === "success"
              ? data.items.data.map((user, index) => (
                  <Table.Tr key={index + user.id}>
                    <Table.Td className="text-center">{user.id}</Table.Td>
                    <Table.Td className="text-center" fw={600} c="black">
                      <Link className="underline" to={`/dashboard/users/${user.id}`}>
                        {user.name}
                      </Link>
                    </Table.Td>
                    <Table.Td className="text-center">
                      {user.program ? (
                        <Badge color={colors?.[user.video_id]}>{user.program}</Badge>
                      ) : (
                        <Badge color={"dark"}>{t("not-completed")}</Badge>
                      )}
                    </Table.Td>
                    <Table.Td className="text-center">
                      {user.transaction.payment_status != null && (
                        <Badge
                          color={
                            user.transaction.payment_status?.toLocaleLowerCase() === "accepted"
                              ? "green"
                              : "red"
                          }
                          rightSection={
                            <Box
                              bg={
                                user.transaction.payment_status?.toLowerCase() === "accepted"
                                  ? "green"
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
                    {/* {import.meta.env.REACT_APP_TEST == true && (
                      <>
                        <Table.Td className="text-center">{formattedDate(user.created_at)}</Table.Td>
                        <Table.Td className="text-center">{formattedDate(user.updated_at)}</Table.Td>
                      </>
                    )} */}
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
