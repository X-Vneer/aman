import ActiveFiltersBar from "@/components/common/active-filters-bar"
import { usePartnersActiveFilterChips } from "@/hooks/use-dashboard-active-filter-chips"
import SearchInput from "@/components/ui/search-input"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { ActionIcon, Button, Group, Space, Stack, Title } from "@mantine/core"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import TableCom from "./components/table.tsx"
import { Link } from "@/lib/i18n/navigation.tsx"

const Partners = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const activeFilterChips = usePartnersActiveFilterChips()

  return (
    <Stack>
      <Group justify="space-between" gap={"lg"}>
        <Title
          className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic"
          size={sm ? "h3" : "h2"}
          order={2}>
          {t("partners.title")}
        </Title>
        <Button component={Link} to={"/dashboard/partners/add"} visibleFrom="md">
          {t("partners.add-button")}
        </Button>
        <ActionIcon component={Link} to={"/dashboard/partners/add"} size={"md"} radius={"sm"} hiddenFrom="md">
          <Plus size={18} />
        </ActionIcon>
      </Group>

      <Space />

      <Group>
        <Group className="grow" justify="space-between" gap={"lg"} wrap="nowrap">
          <SearchInput />
        </Group>
      </Group>
      <ActiveFiltersBar chips={activeFilterChips} />
      <TableCom />
    </Stack>
  )
}

export default Partners
