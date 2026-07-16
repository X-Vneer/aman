import ActiveFiltersBar from "@/components/common/active-filters-bar"
import { useStoriesActiveFilterChips } from "@/hooks/use-dashboard-active-filter-chips"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Group, Space, Stack, Text, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import TableCom from "./components/table"
import SearchInput from "@/components/ui/search-input"
// import Filters from "./components/filters"
import ExportButton from "@/components/common/export-button"
import { GetStories } from "./get-stories"
import DateFilters from "@/components/ui/range-date-filter"

const Stories = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const activeFilterChips = useStoriesActiveFilterChips()

  return (
    <Stack>
      <div>
        <Title
          className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
          size={sm ? "h3" : "h2"}
          order={2}>
          {t("stories.title")}
        </Title>
        <Text size="sm" c={"gary"}>
          {t("stories.description")}
        </Text>
      </div>

      <Space />
      <Group justify="space-between" gap={"lg"} wrap="nowrap">
        <SearchInput />
        <Group gap={"sm"}>
          {/* <Filters /> */}
          <DateFilters />
          <ExportButton queryFun={GetStories} filename="stories" />
        </Group>
      </Group>
      <ActiveFiltersBar chips={activeFilterChips} />

      <TableCom />
    </Stack>
  )
}

export default Stories
