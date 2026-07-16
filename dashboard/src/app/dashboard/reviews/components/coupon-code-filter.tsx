import { useSmallScreen } from "@/hooks/use-small-screen"
import { cn } from "@/utils/cn"
import { Button, Popover, Stack, TextInput } from "@mantine/core"
import { SlidersHorizontal } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const CouponCodeFilter = () => {
  const { t } = useTranslation()

  const [couponCode, setCouponCode] = useQueryState("coupon_code", parseAsString.withDefault(""))
  const [couponCodeState, setCouponCodeState] = useState<string>(couponCode || "")

  const handleApplyFilters = () => {
    if (!couponCodeState.trim()) {
      setCouponCode(null)
      return
    }
    setCouponCode(couponCodeState.trim())
  }

  const sm = useSmallScreen()
  return (
    <Popover width={sm ? 220 : 300} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className={cn("!border !border-gray-300", couponCode && "!border-secondary")}
          color="#5A5A5A"
          size={sm ? "xs" : "sm"}
          leftSection={<SlidersHorizontal size={sm ? 17 : 20} />}>
          {t("financial.users.table.coupon_code")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="!border-none">
        <Stack gap={"sm"}>
          <TextInput
            size="xs"
            value={couponCodeState}
            onChange={(e) => setCouponCodeState(e.target.value)}
            label={t("financial.users.table.coupon_code")}
            placeholder={t("filters.coupon-filter.placeholder")}
          />

          <Button size="sm" onClick={handleApplyFilters}>
            {t("global.apply")}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default CouponCodeFilter

