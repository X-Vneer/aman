import { useSmallScreen } from "@/hooks/use-small-screen"
import { cn } from "@/utils/cn"
import { Button, MultiSelect, Popover, Stack } from "@mantine/core"
import { SlidersHorizontal } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const RateFilter = () => {
  const { t } = useTranslation()

  const [filters, setFilters] = useQueryStates({
    rate_1: parseAsArrayOf(parseAsString).withDefault([]),
    rate_2: parseAsArrayOf(parseAsString).withDefault([]),
    rate_3: parseAsArrayOf(parseAsString).withDefault([]),
    rate_4: parseAsArrayOf(parseAsString).withDefault([]),
  })

  const [state, setState] = useState({
    rate_1: filters.rate_1 || [],
    rate_2: filters.rate_2 || [],
    rate_3: filters.rate_3 || [],
    rate_4: filters.rate_4 || [],
  })

  const handleApplyFilters = () => {
    setFilters({
      rate_1: state.rate_1.length > 0 ? state.rate_1 : null,
      rate_2: state.rate_2.length > 0 ? state.rate_2 : null,
      rate_3: state.rate_3.length > 0 ? state.rate_3 : null,
      rate_4: state.rate_4.length > 0 ? state.rate_4 : null,
    })
  }

  const hasActiveFilters =
    filters.rate_1.length > 0 ||
    filters.rate_2.length > 0 ||
    filters.rate_3.length > 0 ||
    filters.rate_4.length > 0

  const rateOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
  ]

  const sm = useSmallScreen()
  return (
    <Popover width={sm ? 220 : 300} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className={cn("border! border-gray-300!", hasActiveFilters && "border-secondary!")}
          color="#5A5A5A"
          size={sm ? "xs" : "sm"}
          leftSection={<SlidersHorizontal size={sm ? 17 : 20} />}>
          {t("reviews.filters.rate")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="border-none!">
        <Stack gap={"sm"}>
          <MultiSelect
            comboboxProps={{ withinPortal: false }}
            size="xs"
            value={state.rate_1}
            onChange={(value) => setState((prev) => ({ ...prev, rate_1: value }))}
            data={rateOptions}
            label={t("reviews.filters.rate_question_1")}
            placeholder={t("reviews.filters.rate_question_1")}
            clearable
          />
          <MultiSelect
            comboboxProps={{ withinPortal: false }}
            size="xs"
            value={state.rate_2}
            onChange={(value) => setState((prev) => ({ ...prev, rate_2: value }))}
            data={rateOptions}
            label={t("reviews.filters.rate_question_2")}
            placeholder={t("reviews.filters.rate_question_2")}
            clearable
          />
          <MultiSelect
            comboboxProps={{ withinPortal: false }}
            size="xs"
            value={state.rate_3}
            onChange={(value) => setState((prev) => ({ ...prev, rate_3: value }))}
            data={rateOptions}
            label={t("reviews.filters.rate_question_3")}
            placeholder={t("reviews.filters.rate_question_3")}
            clearable
          />
          <MultiSelect
            comboboxProps={{ withinPortal: false }}
            size="xs"
            value={state.rate_4}
            onChange={(value) => setState((prev) => ({ ...prev, rate_4: value }))}
            data={rateOptions}
            label={t("reviews.filters.rate_question_4")}
            placeholder={t("reviews.filters.rate_question_4")}
            clearable
          />

          <Button size="sm" onClick={handleApplyFilters}>
            {t("global.apply")}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default RateFilter
