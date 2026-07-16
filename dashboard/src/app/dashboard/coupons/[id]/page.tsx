import ActiveFiltersBar from "@/components/common/active-filters-bar"
import Error from "@/components/common/error"
import Loader from "@/components/common/loader"
import { RiyalIcon } from "@/components/icons"
import { useCouponDetailGraphChips } from "@/hooks/use-dashboard-active-filter-chips"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Link, useParams } from "@/lib/i18n/navigation"
import { formattedDate } from "@/utils/fornate-dates"
import { BarChart } from "@mantine/charts"
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { useQueries } from "@tanstack/react-query"
import dayjs from "dayjs"
import { CloudDownload, Pen } from "lucide-react"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"
import { usePDF } from "react-to-pdf"
import { generateSearchParams } from "../../reports/page"
import { couponStatus } from "../components/table"
import { Coupon } from "../types"
import DateFilters from "./components/date-filters"
import UsersTable from "./components/table"
import { GetCoupon } from "./get-coupon"
import { GetCouponGraph } from "./get-coupon-graph"
const GraphType = ["all_time", "hourly", "daily", "weekly", "monthly", "yearly", "custom"] as const

export const DataCell = ({ keyToRender, coupon }: { keyToRender: keyof Coupon; coupon: Coupon }) => {
  const { t } = useTranslation()
  return (
    <div>
      <Text c="gray.8">{t(`coupons.view.${keyToRender as "code"}`)}</Text>
      <Text size="lg" fw={500}>
        {keyToRender.includes("date")
          ? dayjs(coupon[keyToRender] as Date).format("DD/MM/YYYY")
          : (coupon[keyToRender] as string)}
      </Text>
    </div>
  )
}
const ViewCoupon = () => {
  const { id } = useParams() as { id: string }
  const searchParams = useOptimisticSearchParams()
  const newSearchParams = generateSearchParams(searchParams, ["dates"])
  const queries = useQueries({
    queries: [
      {
        queryKey: ["coupon", id, searchParams.toString()],
        queryFn: () => GetCoupon(id, searchParams),
      },
      {
        queryKey: ["coupon", "graph", id, newSearchParams.toString()],
        queryFn: () => GetCouponGraph(id, newSearchParams),
      },
    ],
  })

  const [{ data: coupon }, { data: graph }] = queries

  const type = (searchParams.get("dates") || "all_time") as (typeof GraphType)[number]
  const graphData = graph?.[type] || []
  const graphColors = ["#18BDBE", "#9156E6", "#F16238"]

  const { t } = useTranslation()
  const keysToRender = ["name", "code", "amount", "number_of_users", "date_start", "date_end"] as const
  const statisticsKeys = ["paid_amount_after_discount", "paid_amount", "number_of_users"] as const

  const sm = useSmallScreen()
  const graphFilterChips = useCouponDetailGraphChips()
  const { toPDF, targetRef } = usePDF({
    filename: "coupon.pdf",
    page: {
      margin: 5,
    },
  })
  if (queries.find((e) => e.status === "pending")) return <Loader />
  if (queries.find((e) => e.status === "error")) return <Error />
  if (!coupon) return

  return (
    <Stack>
      <Stack ref={targetRef}>
        <Paper radius={"lg"} className="p-3 md:p-5">
          <Group justify="space-between" mb={"lg"}>
            <Group gap="xs">
              <Title order={3}>{t("coupons.view.title")}</Title>
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
            </Group>
            <Group>
              <ActionIcon
                component={Link}
                to={`/dashboard/coupons/${id}/edit`}
                variant="subtle"
                size={"lg"}
                color="gray">
                <Pen size={18} />
              </ActionIcon>
              <Button
                variant="white"
                className="!border !border-gray-300"
                color="#5A5A5A"
                size="sm"
                leftSection={sm ? null : <CloudDownload size={22} />}
                onClick={() => toPDF()}>
                {sm ? <CloudDownload size={22} /> : t("global.export")}
              </Button>
              <DateFilters />
            </Group>
          </Group>
          <ActiveFiltersBar chips={graphFilterChips} />
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {keysToRender.map((e) => {
              return <DataCell coupon={coupon} key={e} keyToRender={e} />
            })}
          </SimpleGrid>
        </Paper>
        <SimpleGrid cols={{ base: 1, md: 3 }}>
          {statisticsKeys.map((key) => {
            return (
              <Paper radius={"lg"} key={key} className="space-y-3 p-3 md:p-5">
                <Text size="sm" c={"gray.8"}>
                  {t(`coupons.view.${key}`)}
                </Text>
                <Text fw={"600"} size="2xl">
                  {coupon[key]}
                  {key === "number_of_users" ? null : <RiyalIcon />}
                </Text>
              </Paper>
            )
          })}
        </SimpleGrid>
        <Paper component={Stack} gap={"lg"} p="lg" className="grow" radius="md">
          <Group justify="space-between">
            <Text size="lg" fw={600}>
              {t("coupons.view.graph.title")}
            </Text>
            <Text size="xs" c={"gray"} dir="ltr">
              {type === "custom"
                ? `${formattedDate(searchParams.get("date_from"))} - ${formattedDate(searchParams.get("date_to"))}`
                : t(`coupons.view.graph.graph-type.${type}`)}{" "}
            </Text>
            {/* <SegmentedControl
              value={type}
              onChange={(value) => setType(value as "all_time" | "hourly")}
              data={[
                {
                  label: t("coupons.view.graph.graph-type.all_time"),
                  value: "all_time",
                },
                {
                  label: t("coupons.view.graph.graph-type.hourly"),
                  value: "hourly",
                },
              ]}
            /> */}
          </Group>
          <Divider color="gray.1" />
          <BarChart
            h={260}
            data={graphData}
            dataKey={"x"}
            withLegend
            series={Object.keys(graph!.references).map((key, index) => {
              return {
                name: key,
                label: graph!.references[key],
                color: graphColors[index],
              }
            })}
            barProps={{ radius: [10, 10, 0, 0] }}
            tickLine="y"
            // yAxisLabel={t("home.revenue-graph.y-axis-label")}
          />
        </Paper>
        <Space />
      </Stack>

      <UsersTable />
    </Stack>
  )
}

export default ViewCoupon
