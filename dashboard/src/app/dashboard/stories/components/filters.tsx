import { useSmallScreen } from "@/hooks/use-small-screen"
import { cn } from "@/utils/cn"
import { Button, Divider, Popover, Radio, Stack } from "@mantine/core"
import { SlidersHorizontal } from "lucide-react"
import { parseAsString, useQueryStates } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const Filters = () => {
  const { t } = useTranslation()
  const [filters, setFilters] = useQueryStates({
    programs: parseAsString.withDefault(""),
    visibility: parseAsString.withDefault(""),
  })

  const [state, setState] = useState<{ programs: string; visibility: string }>(filters)

  const handleApplyFilters = () => {
    setFilters(state)
  }

  const handleChange = (key: "programs" | "visibility", value: string | string[]) => {
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
            (filters["programs"] !== "" || filters["visibility"] !== "") && "!border-secondary",
          )}
          color="#5A5A5A"
          size="sm"
          leftSection={sm ? null : <SlidersHorizontal size={20} />}>
          {sm ? <SlidersHorizontal size={20} /> : t("global.filters")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="!border-none">
        <Stack gap={"sm"}>
          <Radio.Group
            value={state["programs"]}
            onChange={(value) => handleChange("programs", value)}
            label={t(`stories.table.aman_programs`)}>
            <Stack gap={"sm"} mt="xs">
              {(["yes", "not_attender"] as const).map((value) => (
                <Radio
                  key={value}
                  radius={"sm"}
                  size="sm"
                  color="secondary"
                  value={value}
                  label={t(`stories.table.aman_programs-${value}`)}
                />
              ))}
            </Stack>
          </Radio.Group>
          <Radio.Group
            value={state["visibility"]}
            onChange={(value) => handleChange("visibility", value)}
            label={t(`stories.table.visibility`)}>
            <Stack gap={"xs"} mt="xs">
              {(["visible", "hidden"] as const).map((status) => (
                <Radio
                  key={status}
                  radius={"sm"}
                  size="sm"
                  color="secondary"
                  value={status}
                  label={t(`stories.table.visibility-${status}`)}
                />
              ))}
            </Stack>
          </Radio.Group>
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
