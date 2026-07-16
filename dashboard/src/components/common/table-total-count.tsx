import { useSmallScreen } from "@/hooks/use-small-screen"
import { Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

/** Matches Laravel paginator `meta`; `from`/`to` may be omitted in some API typings. */
export type PaginatedMeta = {
  total: number
  from?: number | null
  to?: number | null
}

type Props = {
  meta: PaginatedMeta | undefined
}

/** Shown above list tables that use Laravel-style `items.meta` pagination. */
export default function TableTotalCount({ meta }: Props) {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  if (meta == null) return null

  return (
    <Text size="sm" c="dimmed" mb="sm" ta={sm ? "center" : "start"}>
      {meta.from != null && meta.to != null
        ? t("global.total-results-with-page", {
            total: meta.total.toLocaleString(),
            from: meta.from,
            to: meta.to,
          })
        : t("global.total-results", { total: meta.total.toLocaleString() })}
    </Text>
  )
}
