import RefreshButton from "@/components/common/refresh-button"
import SortableTh from "@/components/common/sortable-th"
import Error from "@/components/common/error"
import Loader from "@/components/common/loader"
import PaginationCom from "@/components/common/pagination"
import TableTotalCount from "@/components/common/table-total-count"
import { useSortParams } from "@/hooks/use-sort-params"
import { Badge, Box, Group, HoverCard, Table, TableTh, TableThead, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { GetStories } from "../get-stories"
import Actions from "./actions"
import ToggleActivity from "./toggle-activity"

const tableHead = [
  "id",
  "first_name",
  "last_name",
  "title",
  "age",
  "mobile",
  "email",
  "aman_programs",
  "video_title",
  "content",
  "visibility",
  "action",
] as const

const SORTABLE: Record<string, string> = {
  id: "id",
  first_name: "first_name",
  last_name: "last_name",
  title: "title",
  age: "age",
  mobile: "mobile",
  email: "email",
}

const TableCom = () => {
  const { t } = useTranslation()
  const { sortColumn, sortDirection, setSortState } = useSortParams()
  const searchParams = useOptimisticSearchParams()

  const { data, status, error, refetch, isFetching } = useQuery({
    queryKey: ["stories", searchParams.toString()],
    queryFn: async () => await GetStories(searchParams),
    staleTime: Infinity,
  })

  if (status === "pending") return <Loader />

  return (
    <>
      <Group justify="space-between" align="center">
        {status === "success" ? <TableTotalCount meta={data.items.meta} /> : <span />}
        <RefreshButton refetch={refetch} isFetching={isFetching} />
      </Group>
      <Table.ScrollContainer minWidth={1500}>
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
                    label={t(`stories.table.${element}`)}
                    currentSortColumn={sortColumn}
                    currentSortDirection={sortDirection}
                    onSort={setSortState}
                    className="!text-center"
                  />
                ) : (
                  <TableTh key={element} className="!text-center">
                    {t(`stories.table.${element}`)}
                  </TableTh>
                )
              })}
            </Table.Tr>
          </TableThead>
          <Table.Tbody>
            {status === "error" ? <Error error={error} /> : null}
            {status === "success"
              ? data.items.data.map((story) => (
                  <Table.Tr key={story.id}>
                    <Table.Td className="text-center">{story.id}</Table.Td>
                    <Table.Td className="text-center" c={"black"} fw={500}>
                      {story.first_name}
                    </Table.Td>
                    <Table.Td className="text-center" c={"black"} fw={500}>
                      {story.last_name}
                    </Table.Td>
                    <Table.Td maw={200}>
                      <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                          <Text size="sm" truncate="end">
                            {story.title}
                          </Text>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm">{story.title}</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Table.Td>
                    <Table.Td className="text-center">{story.age}</Table.Td>
                    <Table.Td className="text-center">{story.mobile}</Table.Td>
                    <Table.Td className="text-center">{story.email}</Table.Td>
                    <Table.Td className="text-center">
                      <Badge
                        color={
                          story.has_video === true ? "green" : story.has_video === false ? "red" : "gray"
                        }
                        rightSection={
                          <Box
                            bg={
                              story.has_video === true ? "green" : story.has_video === false ? "red" : "gray"
                            }
                            className="size-1.5 rounded-full"></Box>
                        }>
                        {story.has_video ? t("general.yes") : t("general.no")}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="text-center">{story.video_title || "-"}</Table.Td>
                    <Table.Td maw={200}>
                      <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                          <Text size="sm" truncate="end">
                            {story.content}
                          </Text>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm">{story.content}</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <ToggleActivity {...story} />
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Actions {...story} />
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
