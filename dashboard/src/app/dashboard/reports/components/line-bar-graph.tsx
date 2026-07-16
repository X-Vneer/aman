import { formattedDate } from "@/utils/fornate-dates"
import { Box, Group, lighten, Paper, Stack, Text } from "@mantine/core"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"
import { BarGraphResponse } from "../types"

type Props = {
  title: string
  title_label: string
  data: BarGraphResponse["data"]
  show_total?: boolean
}

export const GraphType = ["custom", "total", "hourly", "daily", "weekly", "monthly", "yearly"] as const

const LineBarGraph = (props: Props) => {
  const { t } = useTranslation()
  const searchParams = useOptimisticSearchParams()
  const rawType = searchParams.get("dates") as (typeof GraphType)[number]
  const type = GraphType.includes(rawType) ? rawType : "daily"

  const graphData = props.data.graph[type]

  const data = Object.entries(graphData)
    .map(([key, value]: [string, number]) => {
      let render = false

      if (key === "total") {
        render = false
      }
      if (
        (key !== "total" && !searchParams.get("video_ids[]")) ||
        searchParams.get("video_ids[]")?.includes(key)
      ) {
        render = true
      }

      if (render)
        return {
          key: key,
          value: value,
          color: lighten(
            props.data.graph.references[key as keyof BarGraphResponse["data"]["graph"]["total"]]?.color ||
              "#DB9973",
            0.5,
          ),
          label:
            props.data.graph.references[key as keyof BarGraphResponse["data"]["graph"]["total"]]?.label ||
            t("global.zero-program"),
          width:
            ((graphData[key as keyof BarGraphResponse["data"]["graph"]["total"]] / graphData["total"]) *
              100 || 0) + "%",
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
    <Paper component={Stack} gap={"lg"} p="lg" radius="md">
      <Group justify="space-between">
        <Text size="lg" fw={600}>
          {props.title}
        </Text>
        <Group>
          <Stack gap={0} justify="center">
            <Group justify="center">
              <Text size="sm" fw={600}>
                {graphData.total}
              </Text>
              <Box bg={"gray.2"} className="size-2 rounded-full"></Box>
            </Group>
            <Text size="xs" c={"gray"}>
              {props.title_label}
            </Text>
          </Stack>
          <Text size="xs" c={"gray"} dir="ltr">
            {type === "custom"
              ? `${formattedDate(searchParams.get("date_from"))} - ${formattedDate(searchParams.get("date_to"))}`
              : t(`home.line-graph-type.${type as "monthly"}`)}{" "}
          </Text>
        </Group>
      </Group>
      <div className="flex h-5 w-full bg-gray-50">
        {data.map((ele) => {
          return (
            <div
              key={ele.key}
              style={{
                background: lighten(ele.color, 0.3),
                width: ele.width,
              }}
              className="h-full duration-300"></div>
          )
        })}
      </div>
      <Group justify="center" wrap="nowrap">
        {data.map((e) => {
          return (
            <Stack gap={0} justify="center">
              <Group justify="center">
                <Text size="sm" fw={600}>
                  {e.value}
                </Text>
                <Box bg={lighten(e.color, 0.5)} className="size-2 rounded-full"></Box>
              </Group>
              <Text size="xs" c={"gray"}>
                {e.label}
              </Text>
            </Stack>
          )
        })}
      </Group>
    </Paper>
  )
}

export default LineBarGraph
