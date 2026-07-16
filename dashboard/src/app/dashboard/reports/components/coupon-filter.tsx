import { useSmallScreen } from "@/hooks/use-small-screen"
import { cn } from "@/utils/cn"
import { Button, Popover, Stack, TextInput } from "@mantine/core"
import { SlidersHorizontal, TicketPercent } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const CouponFilter = () => {
  const { t } = useTranslation()

  const [coupon, setCoupon] = useQueryState("coupon", parseAsString.withDefault(""))
  const [state, setState] = useState<string>(coupon)
  const handleApplyFilters = () => {
    setCoupon(state)
  }

  const sm = useSmallScreen()
  return (
    <Popover width={sm ? 200 : 250} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className={cn("!border !border-gray-300", coupon.length !== 0 && "!border-secondary")}
          color="#5A5A5A"
          size={sm ? "xs" : "sm"}
          leftSection={<TicketPercent size={sm ? 17 : 20} />}>
          {t("global.coupon-filter")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="!border-none">
        <Stack gap={"sm"}>
          <TextInput
            value={state}
            size="sm"
            label={t("filters.coupon-filter.label")}
            placeholder={t("filters.coupon-filter.placeholder")}
            onChange={(e) => {
              setState(e.target.value.trim())
              if (e.target.value.trim() === "") {
                setCoupon("")
              }
            }}
          />
          <Button size="sm" onClick={handleApplyFilters}>
            {t("global.apply")}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default CouponFilter
