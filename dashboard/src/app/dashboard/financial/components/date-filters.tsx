import { useSmallScreen } from "@/hooks/use-small-screen"
import { cn } from "@/utils/cn"
import { Button, Divider, Group, Popover, Radio, Stack } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import dayjs from "dayjs"
import { SlidersHorizontal } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

const DateFilters = () => {
  const { t } = useTranslation()

  const [dates, setDates] = useQueryState("dates", parseAsString.withDefault(""))
  const [dateFrom, setDateFrom] = useQueryState("date_from", parseAsString.withDefault(""))
  const [dateTo, setDateTo] = useQueryState("date_to", parseAsString.withDefault(""))
  const [state, setState] = useState<string>(dates)
  const [dateFromState, setDateFromState] = useState<string | null>(dateFrom ? dateFrom : null)
  const [dateToState, setDateToState] = useState<string | null>(dateTo ? dateTo : null)

  const handleApplyFilters = () => {
    if (dateFromState && dateToState) {
      setDates("custom")
      setState("")
      setDateFrom(dayjs(dateFromState).utc(true).toISOString())
      setDateTo(dayjs(dateToState).utc(true).toISOString())
    } else {
      setDates(state)
    }
  }

  function setStateHandler(value: string) {
    setDates(() => value)
    setState(value)
    setDateFromState(null)
    setDateToState(null)
    setDateFrom(null)
    setDateTo(null)
  }

  const sm = useSmallScreen()
  return (
    <Popover width={sm ? 220 : 300} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className={cn("border! border-gray-300!", (dates || dateFrom || dateTo) && "!border-secondary")}
          color="#5A5A5A"
          size={sm ? "xs" : "sm"}
          leftSection={<SlidersHorizontal size={sm ? 17 : 20} />}>
          {t("global.dates-filter")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="border-none!">
        <Stack gap={"sm"}>
          <Radio.Group value={state} onChange={setStateHandler} label={t("global.dates-filter")}>
            <Stack gap={"sm"} mt="xs">
              {[
                {
                  label: t("home.line-graph-type.hourly"),
                  value: "hourly",
                },
                {
                  label: t("home.line-graph-type.weekly"),
                  value: "weekly",
                },
                {
                  label: t("home.line-graph-type.daily"),
                  value: "daily",
                },
                {
                  label: t("home.line-graph-type.monthly"),
                  value: "monthly",
                },
                {
                  label: t("home.line-graph-type.yearly"),
                  value: "yearly",
                },
              ].map((e) => (
                <Radio
                  key={e.value}
                  radius={"sm"}
                  size="sm"
                  color="secondary"
                  value={e.value}
                  label={e.label}
                />
              ))}
            </Stack>
          </Radio.Group>
          <Divider />
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

export default DateFilters
