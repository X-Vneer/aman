import ActiveFiltersBar from "@/components/common/active-filters-bar"
import ExportButton from "@/components/common/export-button"
import { useNewsActiveFilterChips } from "@/hooks/use-dashboard-active-filter-chips"
import SearchInput from "@/components/ui/search-input"
import DateFilters from "@/components/ui/range-date-filter"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Link } from "@/lib/i18n/navigation"
import { ActionIcon, Button, Group, Space, Stack, Text, Title } from "@mantine/core"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import TableCom from "./components/table"
import { GetNewsList } from "./get-news-list"

const News = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const activeFilterChips = useNewsActiveFilterChips()

  return (
    <Stack>
      <Group justify="space-between" gap="lg" align="flex-start">
        <div>
          <Title
            className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
            size={sm ? "h3" : "h2"}
            order={2}>
            {t("news.title")}
          </Title>
          <Text size="sm" c="dimmed">
            {t("news.description")}
          </Text>
        </div>
        <Button component={Link} to="/dashboard/news/add" visibleFrom="md">
          {t("news.add-button")}
        </Button>
        <ActionIcon component={Link} to="/dashboard/news/add" size="md" radius="sm" hiddenFrom="md">
          <Plus size={18} />
        </ActionIcon>
      </Group>

      <Space />
      <Group justify="space-between" gap="lg" wrap="nowrap">
        <SearchInput />
        <Group gap="sm">
          <DateFilters />
          <ExportButton queryFun={GetNewsList} filename="news" />
        </Group>
      </Group>
      <ActiveFiltersBar chips={activeFilterChips} />

      <TableCom />
    </Stack>
  )
}

export default News
