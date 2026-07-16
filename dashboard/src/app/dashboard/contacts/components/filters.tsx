import { useSmallScreen } from "@/hooks/use-small-screen"
import { cn } from "@/utils/cn"
import { Button, Checkbox, Divider, Popover, Stack } from "@mantine/core"
import { SlidersHorizontal } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const Filters = () => {
  const { t } = useTranslation()
  const [filters, setFilters] = useQueryStates({
    "types[]": parseAsArrayOf(parseAsString).withDefault([]),
    "statuses[]": parseAsArrayOf(parseAsString).withDefault([]), // Ensure `statuses` is an array
  })

  const [state, setState] = useState<{ "types[]": string[]; "statuses[]": string[] }>(filters)

  const handleApplyFilters = () => {
    setFilters(state)
  }

  const handleChange = (key: "types[]" | "statuses[]", value: string | string[]) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  const sm = useSmallScreen()

  return (
    <Popover width={sm ? 200 : 250} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className={cn(
            "!border !border-gray-300",
            (filters["types[]"].length !== 0 || filters["statuses[]"].length > 0) && "!border-secondary",
          )}
          color="#5A5A5A"
          size="sm"
          leftSection={sm ? null : <SlidersHorizontal size={20} />}>
          {sm ? <SlidersHorizontal size={20} /> : t("global.filters")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="!border-none">
        <Stack gap={"sm"}>
          <Checkbox.Group
            value={state["types[]"]}
            onChange={(value) => handleChange("types[]", value)}
            label={t(`contacts.table.type`)}>
            <Stack gap={"sm"} mt="xs">
              {(["Inquiry", "Complaint", "Suggestion"] as const).map((value) => (
                <Checkbox
                  key={value}
                  radius={"sm"}
                  size="sm"
                  color="secondary"
                  value={value}
                  label={t(`contacts.table.type-${value}`)}
                />
              ))}
            </Stack>
          </Checkbox.Group>
          <Checkbox.Group
            value={state["statuses[]"]} // Ensure "statuses[] is used here
            onChange={(value) => handleChange("statuses[]", value)} // Change to handle statuses
            label={t(`contacts.table.status`)}>
            <Stack gap={"xs"} mt="xs">
              {(["New", "Pending", "Responded"] as const).map((status) => (
                <Checkbox
                  key={status}
                  radius={"sm"}
                  size="sm"
                  color="secondary"
                  value={status}
                  label={t(`contacts.table.status-label-${status.toLocaleLowerCase() as "new"}`)}
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

export default Filters
