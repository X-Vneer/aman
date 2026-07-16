import RefreshButton from "@/components/common/refresh-button"
import SortableTh from "@/components/common/sortable-th"
import Error from "@/components/common/error"
import Loader from "@/components/common/loader"
import PaginationCom from "@/components/common/pagination"
import TableTotalCount from "@/components/common/table-total-count"
import { useSortParams } from "@/hooks/use-sort-params"
import { Link } from "@/lib/i18n/navigation"
import { ActionIcon, Group, Table, TableTh, TableThead } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { Edit } from "lucide-react"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"
import { GetPartners } from "../get-partners"
import DeletePartnerComponent from "./delete-partner"
import ToggleActivity from "./toggle-activity"

const SORTABLE: Record<string, string> = { "partner-name": "name" }

const TableCom = () => {
  const { t } = useTranslation()
  const { sortColumn, sortDirection, setSortState } = useSortParams()

  const searchParams = useOptimisticSearchParams()

  const { data, status, error, refetch, isFetching } = useQuery({
    queryKey: ["partners", searchParams.toString()],
    queryFn: async () => await GetPartners(searchParams),
    // placeholderData: keepPreviousData,
  })

  if (status === "pending") return <Loader />

  return (
    <>
      <Group justify="space-between" align="center">
        {status === "success" ? <TableTotalCount meta={data.items.meta} /> : <span />}
        <RefreshButton refetch={refetch} isFetching={isFetching} />
      </Group>
      <Table.ScrollContainer minWidth={800}>
        <Table
          highlightOnHover
          highlightOnHoverColor="#f6f6f6"
          className="overflow-hidden rounded-md bg-white">
          <TableThead>
            <Table.Tr>
              {(["partner-name", "logo-image", "activate-deactivate", "manage"] as const).map((element) => {
                const sortKey = SORTABLE[element]
                return sortKey ? (
                  <SortableTh
                    key={element}
                    sortKey={sortKey}
                    label={t(`partners.table.${element}`)}
                    currentSortColumn={sortColumn}
                    currentSortDirection={sortDirection}
                    onSort={setSortState}
                    className="!text-center"
                  />
                ) : (
                  <TableTh key={element} className="!text-center">
                    {t(`partners.table.${element}`)}
                  </TableTh>
                )
              })}
            </Table.Tr>
          </TableThead>
          <Table.Tbody>
            {status === "error" ? <Error error={error} /> : null}

            {data?.items.data.map((partner) => (
              <Table.Tr key={partner.id}>
                <Table.Td className="text-center">{partner.name}</Table.Td>
                <Table.Td className="text-center">
                  <div className="relative size-11">
                    <img src={partner.logo} alt={partner.name} className="h-full w-full object-cover" />
                  </div>
                </Table.Td>
                <Table.Td className="flex justify-center text-center">
                  <ToggleActivity {...partner} />
                </Table.Td>
                <Table.Td className="text-center">
                  <Group justify="center">
                    <DeletePartnerComponent {...partner} />
                    <ActionIcon
                      component={Link}
                      to={`/dashboard/partners/${partner.id}`}
                      variant="subtle"
                      radius={"sm"}
                      color="primary">
                      <Edit className="size-5" strokeWidth={1.2} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <PaginationCom last_page={data?.items.meta.last_page} />
    </>
  )
}

export default TableCom