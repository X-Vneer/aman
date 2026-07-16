import ActiveFiltersBar from "@/components/common/active-filters-bar"
import ExportButton from "@/components/common/export-button"
import { useUsersListActiveFilterChips } from "@/hooks/use-dashboard-active-filter-chips"
import SearchInput from "@/components/ui/search-input"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Group, Space, Stack, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import DateFilter from "./components/date-filter"
import Filters from "./components/filters"
import TableCom from "./components/table"
import { GetUsers } from "./get-users"

const FormInformation = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const activeFilterChips = useUsersListActiveFilterChips()

  return (
    <Stack>
      <Group justify="space-between" gap={"lg"}>
        <Title size={sm ? "h3" : "h2"} order={2}>
          {t("form-information.title")}
        </Title>
      </Group>

      <Space />
      <Space />

      <Group justify="space-between" gap={"lg"} wrap="nowrap">
        <SearchInput />
        <Group wrap="nowrap">
          <ExportButton
            queryFun={async (args) => {
              args.append("has_form", "true")
              return await GetUsers(args)
            }}
            filename="users"
          />
          <Filters />
          <DateFilter />
        </Group>
      </Group>
      <ActiveFiltersBar chips={activeFilterChips} />
      <TableCom />
    </Stack>
  )
}

export default FormInformation
