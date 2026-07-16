import { useSmallScreen } from "@/hooks/use-small-screen"
import { Button, Checkbox, Divider, Popover, Stack } from "@mantine/core"
import { SlidersHorizontal } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const paymentStatus = ["Accepted", "Rejected", "UnderReview"] as const
const PaymentStatusFilter = () => {
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
          {t("home.users.table.transaction")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="!border-none">
        <Stack>
          <Checkbox.Group value={state} onChange={setState} label={t("home.users.table.transaction")}>
            <Stack mt="xs">
              {paymentStatus.map((status) => (
                <Checkbox
                  key={status}
                  radius={"sm"}
                  color="secondary"
                  value={status}
                  label={t(`home.users.table.transaction-status.${status.toLocaleLowerCase() as "accepted"}`)}
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

export default PaymentStatusFilter
