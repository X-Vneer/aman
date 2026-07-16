import ActiveFiltersBar from "@/components/common/active-filters-bar"
import DateFilter from "@/components/common/date-filter"
import { useGraphDateAndProgramChips } from "@/hooks/use-dashboard-active-filter-chips"
import { RiyalIcon } from "@/components/icons"
import { BarChart, DonutChart, LineChart } from "@mantine/charts"
import { Divider, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core"
import { useSuspenseQueries } from "@tanstack/react-query"
import { CircleDollarSign, GraduationCap, Users } from "lucide-react"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"
import { GetGeneralStatistics } from "./get-general-statistics"
import { GetRevenueGraph } from "./get-revenue-graph"
import { GetUserGraph } from "./get-user-graph"
import { GetCertificates } from "./reports/get-certificates"
import { generateSearchParams } from "./reports/page"
import { BarGraphResponse } from "./reports/types"
import { GeneralStatisticsResponse } from "./types"

const generalStatistics = [
  {
    key: "total_certificates",
    Icon: GraduationCap,
    unit: null,
  },
  {
    key: "total_revenue",
    Icon: CircleDollarSign,
    unit: "SAR",
  },
  {
    key: "total_users",
    Icon: Users,
    unit: null,
  },
] as const

const GraphType = ["hourly", "daily", "weekly", "monthly", "yearly", "custom"] as const

const DataCell = ({
  keyToRender,
  statistics,
}: {
  keyToRender: (typeof generalStatistics)[number]
  statistics: GeneralStatisticsResponse["data"]
}) => {
  const { t } = useTranslation()
  const { Icon } = keyToRender
  return (
    <Paper component={Group} p="lg" radius={"md"} wrap="nowrap">
      <div className="border-secondary flex size-16 items-center justify-center rounded-full border bg-[var(--mantine-color-secondary-1)]">
        <Icon strokeWidth={1.2} className="text-secondary" />
      </div>
      <Stack gap={0}>
        <Text size="xs" fw={500} c="gray.8">
          {t(`home.statistics.${keyToRender.key}`)}
        </Text>
        <Text size="2xl" fw={600}>
          {statistics[keyToRender.key]} {keyToRender.unit ? <RiyalIcon /> : null}
        </Text>
      </Stack>
    </Paper>
  )
}

const Home = () => {
  const { t } = useTranslation()
  const homeFilterChips = useGraphDateAndProgramChips({})

  const searchParams = useOptimisticSearchParams()
  const newSearchParams = generateSearchParams(searchParams, ["dates"])

  const queries = useSuspenseQueries({
    queries: [
      {
        queryKey: ["home", "generalStatistics", searchParams.toString()],
        queryFn: () => GetGeneralStatistics(searchParams),
      },
      {
        queryKey: ["home", "userGraph", newSearchParams.toString()],
        queryFn: () => GetUserGraph(newSearchParams),
      },
      {
        queryKey: ["home", "revenueGraph", newSearchParams.toString()],
        queryFn: () => GetRevenueGraph(newSearchParams),
      },
      {
        queryKey: ["reports", "certificates", "graph", newSearchParams.toString()],
        queryFn: () => GetCertificates(newSearchParams),
      },
    ],
  })

  const generalStatisticsQuery = queries[0]
  const userGraphQuery = queries[1]
  const revenueGraphQuery = queries[2]
  const certificateGraph = queries[3]
  const rawType = searchParams.get("dates") as (typeof GraphType)[number]
  const type = GraphType.includes(rawType) ? rawType : "daily"

  const graphData = certificateGraph.data.graph[type]

  const data = Object.entries(graphData)
    .map(([key, value]: [string, number]) => {
      if (key === "total") return null
      return {
        key: key,
        value: Number(value),
        color:
          certificateGraph.data.graph.references[key as keyof BarGraphResponse["data"]["graph"]["daily"]]
            ?.color || "",
        label:
          certificateGraph.data.graph.references[key as keyof BarGraphResponse["data"]["graph"]["daily"]]
            ?.label || "",
        width:
          ((graphData[key as keyof BarGraphResponse["data"]["graph"]["daily"]] / graphData["total"]) * 100 ||
            0) + "%",
      }
    })
    .filter(Boolean) as {
    key: string
    value: number
    color: string
    label: string
    width: string
  }[]
  return (
    <Stack gap={"lg"}>
      <Group justify="flex-end">
        <DateFilter />
      </Group>
      <ActiveFiltersBar chips={homeFilterChips} />
      <SimpleGrid spacing="lg" cols={{ base: 1, md: 3 }}>
        {generalStatistics.map((e) => {
          return <DataCell key={e.key} keyToRender={e} statistics={generalStatisticsQuery.data} />
        })}
      </SimpleGrid>
      <Paper component={Stack} gap={"lg"} p="lg" radius="md">
        <Group justify="space-between">
          <Text size="lg" fw={600}>
            {t("home.user-graph.title")}
          </Text>
        </Group>
        <Divider color="gray.1" />
        <div>
          <LineChart
            h={300}
            data={userGraphQuery["data"][type] || []}
            dataKey={"x"}
            withLegend
            yAxisLabel={t("home.user-graph.y-axis-label")}
            series={[
              { name: "y_ar", label: t("langs.ar"), color: "#18BDBE" },
              { name: "y_en", label: t("langs.en"), color: "#F16238" },
              { name: "y_ur", label: t("langs.ur"), color: "#9156E6" },
              { name: "y_fr", label: t("langs.fr"), color: "#3E4142" },
              { name: "y_fil", label: t("langs.fil"), color: "#4642E7" },
              { name: "y_id", label: t("langs.id"), color: "yellow.5" },
            ]}
            curveType="monotone"
          />
        </div>
      </Paper>
      <Group align="stretch" wrap="nowrap" className="max-sm:!flex-col-reverse" gap={"lg"}>
        <Paper component={Stack} gap={"lg"} className="max-sm:w-full" p="lg" shadow="sm" radius="md">
          <Group justify="space-between" wrap="nowrap">
            <Text size="lg" fw={600}>
              {t("home.certificates-statistics.title")}
            </Text>
          </Group>
          <Divider color="gray.1" />
          <Group justify="center" px={"xl"} align="center" h={"100%"}>
            <DonutChart
              size={196}
              thickness={23}
              strokeWidth={0}
              chartLabel={`${t(`home.statistics.total_certificates`)} ${graphData["total"]}`}
              data={data.map((ele) => {
                return {
                  name: ele.label,
                  color: ele.color,
                  value: ele.value,
                }
              })}
            />
          </Group>
        </Paper>

        <Paper component={Stack} gap={"lg"} p="lg" className="grow" radius="md">
          <Group justify="space-between">
            <Text size="lg" fw={600}>
              {t("home.revenue-graph.title")}
            </Text>
          </Group>
          <Divider color="gray.1" />
          <BarChart
            h={210}
            data={revenueGraphQuery["data"][type] || []}
            dataKey={"x"}
            series={[{ name: "y", label: t("home.revenue-graph.y-axis-label"), color: "#18BDBE" }]}
            barProps={{ radius: [10, 10, 0, 0] }}
            tickLine="y"
            yAxisLabel={t("home.revenue-graph.y-axis-label")}
          />
        </Paper>
      </Group>

      {/* <UsersInfo /> */}
    </Stack>
  )
}

export default Home
