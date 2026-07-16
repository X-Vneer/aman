import RefreshButton from "@/components/common/refresh-button"
import SortableTh from "@/components/common/sortable-th"
import Error from "@/components/common/error"
import Loader from "@/components/common/loader"
import PaginationCom from "@/components/common/pagination"
import TableTotalCount from "@/components/common/table-total-count"
import { useSortParams } from "@/hooks/use-sort-params"
import { ActionIcon, Badge, Box, Group, HoverCard, Table, TableTh, TableThead, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import "dayjs/locale/ar"
import relativeTime from "dayjs/plugin/relativeTime"
import { Eye, MessageCircleReply, Paperclip } from "lucide-react"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { GetContacts } from "../get-contacts"
import { ContactsResponse } from "../types"
import ReplayModal from "./replay-modal"

const SORTABLE: Record<string, string> = {
  id: "id",
  name: "name",
  email: "email",
  date: "created_at",
  title: "subject",
}

dayjs.extend(relativeTime)
const tableHead = [
  "id",
  "name",
  "email",
  "date",
  "type",
  "title",
  "video_title",
  "status",
  "message",
  "actions",
] as const
export const contactStatus = {
  New: {
    label: "new",
    color: "blue",
  },
  Pending: {
    label: "pending",
    color: "red",
  },
  Responded: {
    label: "responded",
    color: "green",
  },
} as const

const TableCom = () => {
  const { t, i18n } = useTranslation()
  const { sortColumn, sortDirection, setSortState } = useSortParams()
  const navigate = useNavigate()

  const searchParams = useOptimisticSearchParams()

  useEffect(() => {
    dayjs.locale(i18n.language === "ar" ? "ar" : "en")
  }, [i18n.language])

  const { data, status, error, refetch, isFetching } = useQuery({
    queryKey: ["contacts", searchParams.toString()],
    queryFn: async () => await GetContacts(searchParams),
    staleTime: Infinity,
    // placeholderData: keepPreviousData,
  })

  const [modal, setModal] = useState<ContactsResponse["data"]["items"]["data"][number] | null>(null)
  if (status === "pending") return <Loader />

  return (
    <>
      <Group justify="space-between" align="center">
        {status === "success" ? <TableTotalCount meta={data.items.meta} /> : <span />}
        <RefreshButton refetch={refetch} isFetching={isFetching} />
      </Group>
      <Table.ScrollContainer minWidth={1300}>
        <Table
          highlightOnHover
          highlightOnHoverColor="#f6f6f6"
          className="overflow-hidden rounded-md bg-white">
          <TableThead>
            <Table.Tr>
              {(["id", "name", "email", "date", "type", "title", "video_title", "status", "message", "actions"] as const).map((element) => {
                const sortKey = SORTABLE[element]
                return sortKey ? (
                  <SortableTh
                    key={element}
                    sortKey={sortKey}
                    label={t(`contacts.table.${element}`)}
                    currentSortColumn={sortColumn}
                    currentSortDirection={sortDirection}
                    onSort={setSortState}
                    className="!text-center"
                  />
                ) : (
                  <TableTh key={element} className="!text-center">
                    {t(`contacts.table.${element}`)}
                  </TableTh>
                )
              })}
            </Table.Tr>
          </TableThead>
          <Table.Tbody>
            {status === "error" ? <Error error={error} /> : null}
            {status === "success"
              ? data.items.data.map((contact) => (
                  <Table.Tr key={contact.id}>
                    <Table.Td className="text-center">{contact.id}</Table.Td>
                    <Table.Td className="text-center" c={"black"} fw={500}>
                      {contact.name}
                    </Table.Td>
                    <Table.Td className="text-center">
                      {contact.mobile && contact.mobile.trim() !== "" ? contact.mobile : contact.email}
                    </Table.Td>
                    <Table.Td className="text-center">
                      <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                          <Text size="sm">{dayjs(new Date(contact.created_at)).fromNow()}</Text>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm">
                            {dayjs(new Date(contact.created_at)).format("DD/MM/YYYY HH:mm:ss")}
                          </Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Table.Td>
                    <Table.Td className="text-center">{t(`contacts.table.type-${contact.type}`)}</Table.Td>
                    <Table.Td maw={200}>
                      <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                          <Text size="sm" truncate="end">
                            {contact.subject}
                          </Text>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm"> {contact.subject}</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Table.Td>
                    <Table.Td maw={200}>
                      <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                          <Text size="sm" title={contact.video_title || undefined}>
                            {contact.video_title ? contact.video_title.trim().split(/\s+/)[0] : "-"}
                          </Text>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm">{contact.video_title || "-"}</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Table.Td>

                    <Table.Td className="text-center">
                      <Badge
                        color={contactStatus[contact.status as keyof typeof contactStatus]?.color}
                        rightSection={
                          <Box
                            bg={contactStatus[contact.status as keyof typeof contactStatus]?.color}
                            className="size-1.5 rounded-full"></Box>
                        }>
                        {t(
                          `contacts.table.status-label-${contactStatus[contact.status as keyof typeof contactStatus]?.label}`,
                        )}
                      </Badge>
                    </Table.Td>
                    <Table.Td maw={200}>
                      <HoverCard width={280} shadow="md">
                        <HoverCard.Target>
                          <Group gap="xs">
                            {contact.images && contact.images.length > 0 ? <Paperclip size={14} /> : null}
                            <Text size="sm" truncate="end">
                              {contact.message}
                            </Text>
                          </Group>
                        </HoverCard.Target>
                        <HoverCard.Dropdown>
                          <Text size="sm">{contact.message}</Text>
                        </HoverCard.Dropdown>
                      </HoverCard>
                    </Table.Td>
                    <Table.Td className="text-center">
                      <Group gap="xs" justify="center">
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => {
                            setModal(contact)
                          }}>
                          <MessageCircleReply size={18} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color="gray"
                          onClick={() => {
                            navigate(`/dashboard/contacts/${contact.id}`)
                          }}>
                          <Eye size={18} />
                        </ActionIcon>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              : null}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <ReplayModal state={[modal, setModal]} />
      <PaginationCom last_page={data?.items.meta.last_page} />
    </>
  )
}

export default TableCom
