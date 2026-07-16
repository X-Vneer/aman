import AmanApi from "@/services/aman"
import Loader from "@/components/common/loader"
import {
  Badge,
  Box,
  Code,
  Divider,
  Group,
  Modal,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  Title,
} from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useTranslation } from "react-i18next"
import { useState } from "react"

interface PaymentCallbackLog {
  id: number
  action: string | null
  result: string | null
  status: string | null
  order_id: string | null
  trans_id: string | null
  trans_date: string | null
  amount: string | null
  currency: string | null
  hash: string | null
  rrn: string | null
  card_brand: string | null
  merchant_name: string | null
  transaction_identifier: string | null
  processor_mid: string | null
  methods: string | null
  redirect_url: string | null
  redirect_params: string | null
  redirect_method: string | null
  card: string | null
  card_expiration_date: string | null
  sessionId: string | null
  decline_reason: string | null
  request_data: Record<string, unknown>
  created_at: string
}

interface TransactionDetails {
  id: number
  order_id: string | null
  trans_id: string | null
  hash: string | null
  status: string | null
  result: string | null
  card: string | null
  request: Record<string, unknown> | null
  response: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

interface TransactionDetailsResponse {
  transaction: TransactionDetails
  payment_callback_logs: PaymentCallbackLog[]
}

type Props = {
  transactionId: number | string | null
  onClose: () => void
}

const TransactionDetailsModal = ({ transactionId, onClose }: Props) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<string | null>("details")

  const { data, isLoading, isError } = useQuery<TransactionDetailsResponse>({
    queryKey: ["transaction-details", transactionId],
    queryFn: async () => {
      const response = await AmanApi.get<{ data: TransactionDetailsResponse }>(
        `/financial-management/transactions/${transactionId}/details`,
      )
      return response.data.data
    },
    enabled: !!transactionId,
  })

  if (!transactionId) return null

  const getStatusColor = (status: string | null) => {
    if (!status) return "gray"
    const lowerStatus = status.toLowerCase()
    if (lowerStatus === "settled" || lowerStatus === "accepted") return "green"
    if (lowerStatus === "pending" || lowerStatus === "underreview") return "orange"
    if (lowerStatus === "error" || lowerStatus === "declined" || lowerStatus === "rejected")
      return "red"
    return "blue"
  }

  const getResultColor = (result: string | null) => {
    if (!result) return "gray"
    const lowerResult = result.toLowerCase()
    if (lowerResult === "success") return "green"
    if (lowerResult === "pending" || lowerResult === "redirect") return "orange"
    if (lowerResult === "declined" || lowerResult === "error") return "red"
    return "blue"
  }

  return (
    <Modal
      size="xl"
      onClose={onClose}
      centered
      opened={!!transactionId}
      title={
        <Title order={3} fw={600}>
          {t("financial.transaction-details.title", "Transaction Details")}
        </Title>
      }
      styles={{
        content: {
          maxWidth: "95vw",
          width: "1400px",
        },
        body: {
          padding: 0,
        },
      }}>
      {isLoading ? (
        <Box p="xl">
          <Loader />
        </Box>
      ) : isError ? (
        <Box p="xl">
          <Text c="red">{t("financial.transaction-details.error", "Error loading transaction details")}</Text>
        </Box>
      ) : data ? (
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List px="lg" pt="md">
            <Tabs.Tab value="details">
              {t("financial.transaction-details.details", "Transaction Details")}
            </Tabs.Tab>
            <Tabs.Tab value="history">
              {t("financial.transaction-details.history", "Payment History")} (
              {data.payment_callback_logs.length})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="details" p="lg">
            <ScrollArea h={600}>
              <Stack gap="md">
                <Paper p="md" withBorder radius="md" className="bg-gray-50">
                  <Title order={4} mb="md">
                    {t("financial.transaction-details.basic-info", "Basic Information")}
                  </Title>
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    <div>
                      <Text size="sm" c="gray.7" mb={4}>
                        {t("financial.transaction-details.id", "Transaction ID")}
                      </Text>
                      <Text fw={500}>{data.transaction.id}</Text>
                    </div>
                    <div>
                      <Text size="sm" c="gray.7" mb={4}>
                        {t("financial.transaction-details.order-id", "Order ID")}
                      </Text>
                      <Text fw={500}>{data.transaction.order_id || "-"}</Text>
                    </div>
                    <div>
                      <Text size="sm" c="gray.7" mb={4}>
                        {t("financial.transaction-details.trans-id", "Transaction ID (Gateway)")}
                      </Text>
                      <Text fw={500}>{data.transaction.trans_id || "-"}</Text>
                    </div>
                    <div>
                      <Text size="sm" c="gray.7" mb={4}>
                        {t("financial.transaction-details.hash", "Hash")}
                      </Text>
                      <Code>{data.transaction.hash || "-"}</Code>
                    </div>
                    <div>
                      <Text size="sm" c="gray.7" mb={4}>
                        {t("financial.transaction-details.status", "Status")}
                      </Text>
                      <Badge color={getStatusColor(data.transaction.status)}>
                        {data.transaction.status || "-"}
                      </Badge>
                    </div>
                    <div>
                      <Text size="sm" c="gray.7" mb={4}>
                        {t("financial.transaction-details.result", "Result")}
                      </Text>
                      <Badge color={getResultColor(data.transaction.result)}>
                        {data.transaction.result || "-"}
                      </Badge>
                    </div>
                    <div>
                      <Text size="sm" c="gray.7" mb={4}>
                        {t("financial.transaction-details.card", "Card")}
                      </Text>
                      <Text fw={500}>{data.transaction.card || "-"}</Text>
                    </div>
                    <div>
                      <Text size="sm" c="gray.7" mb={4}>
                        {t("financial.transaction-details.created-at", "Created At")}
                      </Text>
                      <Text fw={500}>
                        {dayjs(data.transaction.created_at).format("DD/MM/YYYY HH:mm:ss")}
                      </Text>
                    </div>
                  </SimpleGrid>
                </Paper>

                {data.transaction.request && (
                  <Paper p="md" withBorder radius="md" className="bg-gray-50">
                    <Title order={4} mb="md">
                      {t("financial.transaction-details.request", "Request Data")}
                    </Title>
                    <Code block className="max-h-64 overflow-auto">
                      {JSON.stringify(data.transaction.request, null, 2)}
                    </Code>
                  </Paper>
                )}

                {data.transaction.response && (
                  <Paper p="md" withBorder radius="md" className="bg-gray-50">
                    <Title order={4} mb="md">
                      {t("financial.transaction-details.response", "Response Data")}
                    </Title>
                    <Code block className="max-h-64 overflow-auto">
                      {JSON.stringify(data.transaction.response, null, 2)}
                    </Code>
                  </Paper>
                )}
              </Stack>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="history" p="lg">
            <ScrollArea h={600}>
              <Stack gap="md">
                {data.payment_callback_logs.length === 0 ? (
                  <Paper p="xl" withBorder radius="md" className="text-center">
                    <Text c="gray.6">
                      {t("financial.transaction-details.no-history", "No payment callback history found")}
                    </Text>
                  </Paper>
                ) : (
                  data.payment_callback_logs.map((log, index) => (
                    <Paper key={log.id} p="md" withBorder radius="md" className="bg-gray-50">
                      <Group justify="space-between" mb="md">
                        <Group gap="xs">
                          <Badge color="blue" variant="light">
                            #{index + 1}
                          </Badge>
                          <Badge color={getStatusColor(log.status)}>{log.status || "-"}</Badge>
                          <Badge color={getResultColor(log.result)}>{log.result || "-"}</Badge>
                        </Group>
                        <Text size="xs" c="gray.6">
                          {dayjs(log.created_at).format("DD/MM/YYYY HH:mm:ss")}
                        </Text>
                      </Group>

                      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mb="md">
                        <div>
                          <Text size="xs" c="gray.7" mb={2}>
                            {t("financial.transaction-details.action", "Action")}
                          </Text>
                          <Text size="sm" fw={500}>
                            {log.action || "-"}
                          </Text>
                        </div>
                        <div>
                          <Text size="xs" c="gray.7" mb={2}>
                            {t("financial.transaction-details.amount", "Amount")}
                          </Text>
                          <Text size="sm" fw={500}>
                            {log.amount ? `${log.amount} ${log.currency || ""}` : "-"}
                          </Text>
                        </div>
                        <div>
                          <Text size="xs" c="gray.7" mb={2}>
                            {t("financial.transaction-details.methods", "Payment Method")}
                          </Text>
                          <Text size="sm" fw={500}>{log.methods || "-"}</Text>
                        </div>
                        <div>
                          <Text size="xs" c="gray.7" mb={2}>
                            {t("financial.transaction-details.card-brand", "Card Brand")}
                          </Text>
                          <Text size="sm" fw={500}>{log.card_brand || "-"}</Text>
                        </div>
                        {log.card && (
                          <div>
                            <Text size="xs" c="gray.7" mb={2}>
                              {t("financial.transaction-details.card", "Card")}
                            </Text>
                            <Text size="sm" fw={500}>{log.card}</Text>
                          </div>
                        )}
                        {log.rrn && (
                          <div>
                            <Text size="xs" c="gray.7" mb={2}>
                              {t("financial.transaction-details.rrn", "RRN")}
                            </Text>
                            <Text size="sm" fw={500}>{log.rrn}</Text>
                          </div>
                        )}
                        {log.decline_reason && (
                          <div style={{ gridColumn: "1 / -1" }}>
                            <Text size="xs" c="gray.7" mb={2}>
                              {t("financial.transaction-details.decline-reason", "Decline Reason")}
                            </Text>
                            <Text size="sm" fw={500} c="red">
                              {log.decline_reason}
                            </Text>
                          </div>
                        )}
                      </SimpleGrid>

                      <Divider my="sm" />

                      <details className="cursor-pointer">
                        <summary className="text-sm font-medium text-gray-700 mb-2">
                          {t("financial.transaction-details.full-data", "View Full Request Data")}
                        </summary>
                        <Code block className="max-h-48 overflow-auto mt-2">
                          {JSON.stringify(log.request_data, null, 2)}
                        </Code>
                      </details>
                    </Paper>
                  ))
                )}
              </Stack>
            </ScrollArea>
          </Tabs.Panel>
        </Tabs>
      ) : null}
    </Modal>
  )
}

export default TransactionDetailsModal
