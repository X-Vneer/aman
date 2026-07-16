import { Group, Space, Stack, Title } from "@mantine/core"
import UsersTable from "./users-tabel"
import { useTranslation } from "react-i18next"
import { useSmallScreen } from "@/hooks/use-small-screen"
import SearchInput from "@/components/ui/search-input"
import ExportButton from "@/components/common/export-button"
import { GetUsersInfo } from "../get-users"

const UsersInfo = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  return (
    <Stack>
      <Space />
      <Space />

      <Group justify="space-between" gap={"lg"}>
        <Title size={sm ? "h4" : "h3"} order={2}>
          {t("users-info.title")}
        </Title>
      </Group>

      <Group justify="space-between" gap={"lg"} wrap="nowrap">
        <SearchInput />
        <ExportButton queryFun={GetUsersInfo} filename="users" />
      </Group>
      <UsersTable />
    </Stack>
  )
}

export default UsersInfo
