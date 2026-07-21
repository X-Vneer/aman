import ActiveFiltersBar from "@/components/common/active-filters-bar"
import { usePartnersActiveFilterChips } from "@/hooks/use-dashboard-active-filter-chips"
import SearchInput from "@/components/ui/search-input"
import usePermissions from "@/hooks/use-permissions"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Link } from "@/lib/i18n/navigation"
import { ActionIcon, Button, Group, Space, Stack, Title } from "@mantine/core"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import RenderPrograms from "./components/render-programs"

const Programs = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const hasPermissionTo = usePermissions()
  const activeFilterChips = usePartnersActiveFilterChips()
  return (
    <Stack>
      <Group justify="space-between" gap={"lg"}>
        <Title size={"h2"} order={2} className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic">
          {t(`programs.title`)}
        </Title>
        {hasPermissionTo("Programs:Add") ? (
          <>
            <Button visibleFrom="md" component={Link} to={`/dashboard/programs/add`}>
              {t("programs.add-button")}
            </Button>
            <ActionIcon
              size={"md"}
              radius={"sm"}
              hiddenFrom="md"
              component={Link}
              to={`/dashboard/programs/add`}>
              <Plus size={18} />
            </ActionIcon>
          </>
        ) : null}
      </Group>

      <Space />
      <Space />

      <Group>
        <Group className="grow" justify="space-between" gap={"lg"} wrap="nowrap">
          <SearchInput />
        </Group>
        {/* <Filters /> */}
      </Group>
      <ActiveFiltersBar chips={activeFilterChips} />
      {/* <TableCom /> */}
      <RenderPrograms />
    </Stack>
  )
}

export default Programs
