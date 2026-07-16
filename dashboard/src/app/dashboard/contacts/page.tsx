import ActiveFiltersBar from "@/components/common/active-filters-bar"
import { useContactsActiveFilterChips } from "@/hooks/use-dashboard-active-filter-chips"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Group, Space, Stack, Text, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import TableCom from "./components/table"
import SearchInput from "@/components/ui/search-input"
import Filters from "./components/filters"

const Contacts = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const activeFilterChips = useContactsActiveFilterChips()

  return (
    <Stack>
      <div>
        <Title
          className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
          size={sm ? "h3" : "h2"}
          order={2}>
          {t("contacts.title")}
        </Title>
        <Text size="sm" c={"gary"}>
          {t("contacts.description")}
        </Text>
      </div>

      <Space />
      <Group justify="space-between" gap={"lg"} wrap="nowrap">
        <SearchInput />
        <Filters />
      </Group>
      <ActiveFiltersBar chips={activeFilterChips} />

      <TableCom />
    </Stack>
  )
}

export default Contacts
