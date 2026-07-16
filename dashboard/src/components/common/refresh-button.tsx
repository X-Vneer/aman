import { ActionIcon, Tooltip } from "@mantine/core"
import { RefreshCw } from "lucide-react"
import { useTranslation } from "react-i18next"

interface RefreshButtonProps {
  refetch: () => void
  isFetching: boolean
}

export default function RefreshButton({ refetch, isFetching }: RefreshButtonProps) {
  const { t } = useTranslation()
  return (
    <Tooltip label={t("common.refresh")} withArrow>
      <ActionIcon
        variant="subtle"
        color="gray"
        aria-label={t("common.refresh")}
        onClick={() => refetch()}
        disabled={isFetching}>
        <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
      </ActionIcon>
    </Tooltip>
  )
}
