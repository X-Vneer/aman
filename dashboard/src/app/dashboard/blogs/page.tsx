import ActiveFiltersBar from "@/components/common/active-filters-bar"
import ExportButton from "@/components/common/export-button"
import { useBlogsActiveFilterChips } from "@/hooks/use-dashboard-active-filter-chips"
import SearchInput from "@/components/ui/search-input"
import DateFilters from "@/components/ui/range-date-filter"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Link } from "@/lib/i18n/navigation"
import { ActionIcon, Button, Group, Space, Stack, Text, Title } from "@mantine/core"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import TableCom from "./components/table"
import { GetBlogs } from "./get-blogs"

const Blogs = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const activeFilterChips = useBlogsActiveFilterChips()

  return (
    <Stack>
      <Group justify="space-between" gap="lg" align="flex-start">
        <div>
          <Title
            className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
            size={sm ? "h3" : "h2"}
            order={2}>
            {t("blogs.title")}
          </Title>
          <Text size="sm" c="dimmed">
            {t("blogs.description")}
          </Text>
        </div>
        <Button component={Link} to="/dashboard/blogs/add" visibleFrom="md">
          {t("blogs.add-button")}
        </Button>
        <ActionIcon component={Link} to="/dashboard/blogs/add" size="md" radius="sm" hiddenFrom="md">
          <Plus size={18} />
        </ActionIcon>
      </Group>

      <Space />
      <Group justify="space-between" gap="lg" wrap="nowrap">
        <SearchInput />
        <Group gap="sm">
          <DateFilters />
          <ExportButton queryFun={GetBlogs} filename="blogs" />
        </Group>
      </Group>
      <ActiveFiltersBar chips={activeFilterChips} />

      <TableCom />
    </Stack>
  )
}

export default Blogs
