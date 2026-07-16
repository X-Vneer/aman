import { ActionIcon, Group, Paper, Text } from "@mantine/core"
import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

export type ActiveFilterChip = {
  id: string
  label: string
  value: string
  onRemove: () => void
}

type Props = {
  chips: ActiveFilterChip[]
}

/** Compact row of removable pills for current URL / nuqs filters (RTL-friendly). */
export default function ActiveFiltersBar({ chips }: Props) {
  const { t, i18n } = useTranslation()
  if (!chips.length) return null

  return (
    <Paper
      radius="md"
      p="sm"
      withBorder
      className="border-slate-200/80 bg-slate-50/90"
      mb="sm">
      <Group gap="xs" wrap="wrap" align="center">
        <Text size="sm" fw={600} c="gray.7" className="shrink-0">
          {t("global.active-filters.title")}
        </Text>
        {chips.map((chip) => (
          <Group
            key={chip.id}
            gap={6}
            wrap="nowrap"
            className="max-w-full rounded-full border border-blue-200/80 bg-blue-50 px-2.5 py-1 pe-1">
            <Text size="sm" className="min-w-0 truncate leading-snug" dir={i18n.dir()}>
              <Text component="span" size="sm" fw={700} c="blue.8">
                {chip.label}:
              </Text>{" "}
              <Text component="span" size="sm" c="gray.8">
                {chip.value}
              </Text>
            </Text>
            <ActionIcon
              size="sm"
              variant="transparent"
              color="blue"
              radius="xl"
              aria-label={t("global.active-filters.remove")}
              onClick={chip.onRemove}>
              <X size={16} strokeWidth={2.25} />
            </ActionIcon>
          </Group>
        ))}
      </Group>
    </Paper>
  )
}
