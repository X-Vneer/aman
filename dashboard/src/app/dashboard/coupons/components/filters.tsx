import DateRangeFilter from "@/components/common/date-range-filter"
import ProgramFilter from "@/components/common/program-filter"
import { Group } from "@mantine/core"
import StatusFilter from "./coupon-status-filter"

const Filters = () => {
  return (
    <Group>
      <StatusFilter />
      <ProgramFilter />
      <DateRangeFilter />
    </Group>
  )
}

export default Filters
