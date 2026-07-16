import { useSmallScreen } from "@/hooks/use-small-screen"

import { Button, Checkbox, Divider, Popover, Stack } from "@mantine/core"
import { SlidersHorizontal } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const couponStatus = ["Active", "Inactive", "Expired"] as const
const StatusFilter = () => {
  const { t } = useTranslation()
  const [filters, setFilters] = useQueryState("statuses[]", parseAsArrayOf(parseAsString).withDefault([""]))
  const [state, setState] = useState<string[]>(filters)
  const handleApplyFilters = () => {
    setFilters(state)
  }
  const sm = useSmallScreen()
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className="!border !border-gray-300"
          color="#5A5A5A"
          size={sm ? "xs" : "sm"}
          leftSection={<SlidersHorizontal size={sm ? 17 : 20} />}>
          {t("global.filters")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="!border-none">
        <Stack>
          <Checkbox.Group value={state} onChange={setState} label={t("coupons.table.status")}>
            <Stack mt="xs">
              {couponStatus.map((status) => (
                <Checkbox
                  key={status}
                  radius={"sm"}
                  color="secondary"
                  value={status}
                  label={t(`coupons.table.status-label.${status.toLocaleLowerCase() as "active"}`)}
                />
              ))}
            </Stack>
          </Checkbox.Group>
          <Divider />
          <Button size="sm" onClick={handleApplyFilters}>
            {t("global.apply")}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default StatusFilter
