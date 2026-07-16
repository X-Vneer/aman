import { useSmallScreen } from "@/hooks/use-small-screen"
import { cn } from "@/utils/cn"
import { Button, Divider, MultiSelect, Popover, Stack } from "@mantine/core"
import { Tag } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const PRESENCE_VALUES = ["with", "without"] as const

const CouponPresenceFilter = () => {
  const { t } = useTranslation()
  const [filters, setFilters] = useQueryStates({
    "coupon_presence[]": parseAsArrayOf(parseAsString).withDefault([]),
  })
  const [state, setState] = useState<string[]>(filters["coupon_presence[]"] || [])

  const handleApplyFilters = () => {
    setFilters({
      "coupon_presence[]": state.length > 0 ? state : null,
    })
  }

  const hasActive = (filters["coupon_presence[]"]?.length ?? 0) > 0
  const sm = useSmallScreen()

  const data = PRESENCE_VALUES.map((value) => ({
    value,
    label: t(`financial.filters.coupon-presence.${value}`),
  }))

  return (
    <Popover width={sm ? 240 : 280} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className={cn("!border !border-gray-300", hasActive && "!border-secondary")}
          color="#5A5A5A"
          size={sm ? "xs" : "sm"}
          leftSection={<Tag size={sm ? 17 : 20} />}>
          {t("financial.filters.coupon-presence.label")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="!border-none">
        <Stack gap="sm">
          <MultiSelect
            comboboxProps={{ withinPortal: false }}
            size="sm"
            value={state}
            onChange={setState}
            data={data}
            label={t("financial.filters.coupon-presence.label")}
            placeholder={t("financial.filters.coupon-presence.placeholder")}
            clearable
          />
          <Divider />
          <Button size="sm" onClick={handleApplyFilters}>
            {t("global.apply")}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default CouponPresenceFilter
