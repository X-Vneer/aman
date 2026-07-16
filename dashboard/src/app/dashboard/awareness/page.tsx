import SearchInput from "@/components/ui/search-input"
import usePermissions from "@/hooks/use-permissions"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Link } from "@/lib/i18n/navigation"
import { ActionIcon, Button, Group, Space, Stack, Title } from "@mantine/core"
import { Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import RenderElements from "./components/render-elements"

const Awareness = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const hasPermissionTo = usePermissions()

  return (
    <Stack>
      <Group justify="space-between" gap={"lg"}>
        <Title size={"h2"} order={2} className="ltr:!font-customEnglish ltr:!font-normal ltr:!italic">
          {t(`awareness.title`)}
        </Title>
        {hasPermissionTo("Awareness:Add") ? (
          <>
            <Button visibleFrom="md" component={Link} to={`/dashboard/awareness/add`}>
              {t("Awareness.add-button")}
            </Button>
            <ActionIcon
              size={"md"}
              radius={"sm"}
              hiddenFrom="md"
              component={Link}
              to={`/dashboard/awareness/add`}>
              <Plus size={18} />
            </ActionIcon>
          </>
        ) : null}
      </Group>

      <Space />
      <Space />
      <RenderElements />
    </Stack>
  )
}

export default Awareness
