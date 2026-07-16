import {
  Button,
  Divider,
  Group,
  lighten,
  Paper,
  SimpleGrid,
  Skeleton,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core"
import { useTranslation } from "react-i18next"

import ActiveFiltersBar from "@/components/common/active-filters-bar"
import ProgramFilter from "@/components/common/program-filter"
import { useGraphDateAndProgramChips } from "@/hooks/use-dashboard-active-filter-chips"
import { RiyalIcon } from "@/components/icons"
import usePermissions from "@/hooks/use-permissions"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { formattedDate } from "@/utils/fornate-dates"
import { BarChart } from "@mantine/charts"
import { useQueries, useQueryClient } from "@tanstack/react-query"
import { CloudDownload, RefreshCw } from "lucide-react"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { usePDF } from "react-to-pdf"
import { generateSearchParams } from "../reports/page"
import DateFilters from "./components/date-filters"
import EditPriceModal from "./components/edit-price-modal"
import StatisticsGraph from "./components/statistics-graph"
import UsersInfo from "./components/users-info"
import { GetFinancialStatistics } from "./get-financial-statistics"
import { GetFinancialVideoGraph } from "./get-financial-video-graph"
const GraphType = ["hourly", "daily", "weekly", "monthly", "yearly", "custom"] as const

const Financial = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const graphFilterChips = useGraphDateAndProgramChips({})
  const queryClient = useQueryClient()
  const params = useOptimisticSearchParams()
  const newSearchParams = generateSearchParams(params, ["dates"])
  const queries = useQueries({
    queries: [
      {
        queryKey: ["financial", "generalStatistics", params.toString()],
        queryFn: () => GetFinancialStatistics(params),
      },
      {
        queryKey: ["financial", "graph", newSearchParams.toString()],
        queryFn: () => GetFinancialVideoGraph(newSearchParams),
      },
    ],
  })
  const [FinancialStatisticsQuery, graph] = queries
  const isRefreshing = FinancialStatisticsQuery.isFetching || graph.isFetching

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["financial"] })
  }

  // handle graph type
  const type = (params.get("dates") || "monthly") as (typeof GraphType)[number]
  const graphData = graph.data?.[type] || []

  // handle permissions
  const hasPermissionTo = usePermissions()

  const { toPDF, targetRef } = usePDF({
    filename: "financial.pdf",
    page: {
      margin: 5,
    },
  })

  const series = graph.data?.references
    ? (Object.entries(graph.data?.references)
        .map(([key, value]) => {
          if (key === "y") return null
          return {
            name: key,
            label: value.label,
            color: value.color ? lighten(value.color, 0.3) : "red",
          }
        })
        .filter(Boolean) as { name: string; label: string; color: string }[])
    : []

  return (
    <Stack>
      <Group justify="space-between" gap={"lg"}>
        <Title size={sm ? "h3" : "h2"} order={2}>
          {t("financial.title")}
        </Title>
        <Group>
          {hasPermissionTo("Financial:Edit") ? (
            <EditPriceModal initial={FinancialStatisticsQuery.data?.videos_revenue} />
          ) : null}
          <DateFilters />
          <ProgramFilter />
          <Button
            variant="white"
            className="!border !border-gray-300"
            color="#5A5A5A"
            size="sm"
            leftSection={sm ? null : <RefreshCw size={22} className={isRefreshing ? "animate-spin" : ""} />}
            loading={isRefreshing}
            onClick={handleRefresh}
            aria-label={t("global.refresh", "Refresh")}>
            {sm ? <RefreshCw size={22} className={isRefreshing ? "animate-spin" : ""} /> : t("global.refresh", "Refresh")}
          </Button>
          <Button
            variant="white"
            className="!border !border-gray-300"
            color="#5A5A5A"
            size="sm"
            leftSection={sm ? null : <CloudDownload size={22} />}
            onClick={() => toPDF()}>
            {sm ? <CloudDownload size={22} /> : t("global.export")}
          </Button>
        </Group>
      </Group>
      <ActiveFiltersBar chips={graphFilterChips} />
      <Stack ref={targetRef}>
        <Space />
        {FinancialStatisticsQuery.isLoading ? (
          <SimpleGrid cols={{ base: 1, md: 3 }}>
            <Paper radius={"lg"} className="space-y-3 p-3 md:p-5">
              <Skeleton w={"50%"} c={"gray.1"} h={18} />
              <Skeleton w={"100%"} h={35} />
            </Paper>
            <Paper radius={"lg"} className="space-y-3 p-3 md:p-5">
              <Skeleton w={"50%"} c={"gray.1"} h={18} />
              <Skeleton w={"100%"} h={35} />
            </Paper>
            <Paper radius={"lg"} className="space-y-3 p-3 md:p-5">
              <Skeleton w={"50%"} c={"gray.1"} h={18} />
              <Skeleton w={"100%"} h={35} />
            </Paper>
          </SimpleGrid>
        ) : FinancialStatisticsQuery.isError ? (
          <Text>Error</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {FinancialStatisticsQuery.data?.videos_revenue?.map((ele) => {
              return <StatisticsGraph {...ele} />
            })}

            <Paper radius={"lg"} className="space-y-3 p-3 md:p-5">
              <Text size="sm" c={"gray.8"}>
                {t("financial.total-revenue")}
              </Text>

              <SimpleGrid cols={3} className=" ">
                <Text fw={"600"} size="2xl">
                  {FinancialStatisticsQuery.data?.total_revenue}
                  <RiyalIcon />
                </Text>
                <Text>
                  {t("general.taxes")} : {FinancialStatisticsQuery.data?.total_tax_value}
                  <RiyalIcon />
                </Text>
                <Text>
                  {t("general.discounts")} : {FinancialStatisticsQuery.data?.total_discount_value}
                  <RiyalIcon />
                </Text>
              </SimpleGrid>
            </Paper>
          </SimpleGrid>
        )}

        <Paper component={Stack} gap={"lg"} p="lg" className="grow" radius="md">
          <Group justify="space-between">
            <Text size="lg" fw={600}>
              {t("home.revenue-graph.title")}
            </Text>
            <Text size="xs" c={"gray"} dir="ltr">
              {type === "custom"
                ? `${formattedDate(params.get("date_from"))} - ${formattedDate(params.get("date_to"))}`
                : t(`home.line-graph-type.${type as "monthly"}`)}{" "}
            </Text>
          </Group>
          <Divider color="gray.1" />
          <BarChart
            h={290}
            data={graphData}
            dataKey={"x"}
            series={series}
            barProps={{ radius: [4, 4, 0, 0] }}
            tickLine="y"
            type="stacked"
            yAxisLabel={t("home.revenue-graph.y-axis-label")}
          />
        </Paper>
      </Stack>

      <Space />

      <UsersInfo />
    </Stack>
  )
}

export default Financial
