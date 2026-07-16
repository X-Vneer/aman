/* eslint-disable react-hooks/exhaustive-deps */
import { useSmallScreen } from "@/hooks/use-small-screen"
import { cn } from "@/utils/cn"
import { Button, Group, Popover, Stack } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import dayjs from "dayjs"
import { SlidersHorizontal } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

const DateFilter = () => {
  const { t } = useTranslation()

  const [dateFrom, setDateFrom] = useQueryState("date_from", parseAsString.withDefault(""))
  const [dateTo, setDateTo] = useQueryState("date_to", parseAsString.withDefault(""))
  const [dateFromState, setDateFromState] = useState<string | null>(dateFrom ? dateFrom : null)
  const [dateToState, setDateToState] = useState<string | null>(dateTo ? dateTo : null)

  const handleApplyFilters = () => {
    if (!dateFromState && !dateToState) {
      setDateFrom(null)
      setDateTo(null)
      return
    }
    setDateFrom(dayjs(dateFromState).utc(true).toISOString())
    setDateTo(dayjs(dateToState).utc(true).toISOString())
  }

  const sm = useSmallScreen()
  return (
    <Popover width={sm ? 220 : 300} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className={cn("border! border-gray-300!", (dateFrom || dateTo) && "!border-secondary")}
          color="#5A5A5A"
          size={sm ? "xs" : "sm"}
          leftSection={<SlidersHorizontal size={sm ? 17 : 20} />}>
          {t("global.dates-filter")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="border-none!">
        <Stack gap={"sm"}>
          <Group wrap="nowrap">
            <DateInput
              popoverProps={{ withinPortal: false }}
              size="xs"
              clearable
              value={dateFromState}
              onChange={setDateFromState}
              className="grow"
              label={t(`reports.general.filters.date_from`)}
              placeholder={t(`reports.general.filters.date_from`)}
            />
            <DateInput
              popoverProps={{ withinPortal: false }}
              size="xs"
              clearable
              minDate={dateFromState ? dayjs(dateFromState).add(1, "day").toDate() : undefined}
              value={dateToState}
              onChange={setDateToState}
              className="grow"
              label={t(`reports.general.filters.date_to`)}
              placeholder={t(`reports.general.filters.date_to`)}
            />
          </Group>

          <Button size="sm" onClick={handleApplyFilters}>
            {t("global.apply")}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default DateFilter
