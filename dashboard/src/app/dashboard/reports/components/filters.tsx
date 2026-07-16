import { Group } from "@mantine/core"
import LangFilter from "./lang-filter"
import ProgramFilter from "./program-filter"
import DateFilter from "./date-filter"
import CouponFilter from "./coupon-filter"
import PaymentMethodFilter from "./payment-method-filter"

const Filters = () => {
  return (
    <Group>
      <LangFilter />
      <ProgramFilter />
      <DateFilter />
      <CouponFilter />
      <PaymentMethodFilter />
    </Group>
  )
}

export default Filters
