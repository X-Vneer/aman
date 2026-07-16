import { Paper, SimpleGrid, Text } from "@mantine/core"

import { RiyalIcon } from "@/components/icons"
import { VideosRevenue } from "../types"
import { useTranslation } from "react-i18next"

const StatisticsGraph = (props: VideosRevenue) => {
  const { t } = useTranslation()
  return (
    <Paper radius={"lg"} className="space-y-3 p-3 md:p-5">
      <Text size="sm" c={"gray.8"}>
        {props.title}
      </Text>
      <SimpleGrid cols={3} className=" ">
        <Text fw={"600"} size="lg">
          {props.revenue}
          <RiyalIcon />
        </Text>
        <Text>
          {t("general.taxes")} : {props.tax_value}
          <RiyalIcon />
        </Text>
        <Text>
          {t("general.discounts")} : {props.discount_value}
          <RiyalIcon />
        </Text>
      </SimpleGrid>
    </Paper>
  )
}

export default StatisticsGraph
