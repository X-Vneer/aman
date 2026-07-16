import RefreshButton from "@/components/common/refresh-button"
import SortableTh from "@/components/common/sortable-th"
import Error from "@/components/common/error"
import Loader from "@/components/common/loader"
import PaginationCom from "@/components/common/pagination"
import TableTotalCount from "@/components/common/table-total-count"
import useColors from "@/hooks/use-colors"
import { useSortParams } from "@/hooks/use-sort-params"
import { Badge, Divider, Group, HoverCard, Stack, Table, TableTh, TableThead, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { Heart } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { GetReviews } from "../get-reviews"
import ToggleReviewActive from "./toggle-review-active"

const SORTABLE: Record<string, string> = {
  id: "id",
  name: "user_name",
  comments: "comment",
}

const tableHead = ["id", "name", "program", "rate_1", "rate_2", "rate_3", "rate_4", "comments", "is-active"] as const

const TableCom = () => {
  const { t } = useTranslation()
  const { sortColumn, sortDirection, setSortState } = useSortParams()

  const searchParams = useOptimisticSearchParams()

  const { data, status, error, refetch, isFetching } = useQuery({
    queryKey: ["reviews", searchParams.toString()],
    queryFn: async () => await GetReviews(searchParams),
    staleTime: Infinity,
    // placeholderData: keepPreviousData,
  })
  const { data: colors } = useColors()
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
              {tableHead.map((element, index) => {
                const sortKey = SORTABLE[element]
                const isRateCol = index >= 3 && index <= 6
                if (sortKey) {
                  return (
                    <SortableTh
                      key={element}
                      sortKey={sortKey}
                      label={t(`reviews.table.${element}`)}
                      currentSortColumn={sortColumn}
                      currentSortDirection={sortDirection}
                      onSort={setSortState}
                      className="!text-center"
                    />
                  )
                }
                return (
                  <TableTh key={element} className={isRateCol ? "" : "!text-center"}>
                    {element.includes("rate_") ? (
                      <HoverCard position="top" width={280}>
                        <HoverCard.Target>
                          <span className="cursor-pointer">{t(`reviews.table.${element}`)}</span>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Stack>
                            <Text size="sm" c={"gray"}>
                              {t(`reviews.rating-list.${element.replace("rate_", "") as "1"}`)}
                            </Text>
                            <Divider />
                            <Group align="center" justify="space-between">
                              <Text size="xs">{t(`reviews.table.average`)}</Text>
                              <Group gap={"4"}>
                                {data?.helpers.averages[element as "rate_1"]}
                                <Heart className="fill-red-500 text-red-500" />
                              </Group>
                            </Group>
                          </Stack>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    ) : (
                      t(`reviews.table.${element}`)
                    )}
                  </TableTh>
                )
              })}
            </Table.Tr>
          </TableThead>
          <Table.Tbody>
            {status === "error" ? <Error error={error} /> : null}
            {status === "success"
              ? data.items.data.map((review) => (
                  <Table.Tr key={review.id}>
                    <Table.Td className="text-center">{review.user.id}</Table.Td>
                    <Table.Td className="text-center">{review.user.full_name}</Table.Td>
                    <Table.Td className="text-center">
                      <Badge color={colors?.[review.video_id]}>{review.video_title}</Badge>
                    </Table.Td>

                    <Table.Td className="text-center">
                      <Group>
                        {Array(Number(review.rate_1))
                          .fill("")
                          .map((e, index) => (
                            <Heart key={index} className="fill-red-500 text-red-500" />
                          ))}
                      </Group>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Group>
                        {Array(Number(review.rate_2))
                          .fill("")
                          .map((e, index) => (
                            <Heart key={index} className="fill-red-500 text-red-500" />
                          ))}
                      </Group>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Group>
                        {Array(Number(review.rate_3))
                          .fill("")
                          .map((e, index) => (
                            <Heart key={index} className="fill-red-500 text-red-500" />
                          ))}
                      </Group>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Group>
                        {Array(Number(review.rate_4))
                          .fill("")
                          .map((e, index) => (
                            <Heart key={index} className="fill-red-500 text-red-500" />
                          ))}
                      </Group>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                          <Text className="max-w-[200px]" size="sm" truncate="end">
                            {review.comment}
                          </Text>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm">{review.comment}</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <ToggleReviewActive review={review} />
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
