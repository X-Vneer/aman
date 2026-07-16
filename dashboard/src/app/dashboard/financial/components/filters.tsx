import ProgramFilter from "@/components/common/program-filter"
import { Group } from "@mantine/core"
import PaymentStatusFilter from "./payment-status-filter"

const Filters = () => {
  return (
    <Group>
      <PaymentStatusFilter />
      <ProgramFilter />
    </Group>
  )
}

export default Filters
