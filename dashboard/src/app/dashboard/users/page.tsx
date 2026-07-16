import ActiveFiltersBar from "@/components/common/active-filters-bar"
import ExportButton from "@/components/common/export-button"
import { useUsersListActiveFilterChips } from "@/hooks/use-dashboard-active-filter-chips"
import SearchInput from "@/components/ui/search-input"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { ActionIcon, Alert, Button, Group, Space, Stack, Title } from "@mantine/core"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import CouponFilter from "../reports/components/coupon-filter"
import Filters from "./components/filters"
import TableCom from "./components/table"
import UserModal from "./components/user-modal"
import { GetUsers } from "./get-users"
import { Plus, TriangleAlert } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import DateFilter from "./components/date-filter"

const Users = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const activeFilterChips = useUsersListActiveFilterChips()
  const [coupon] = useQueryState("coupon", parseAsString.withDefault(""))
  const [showCouponNotice, setShowCouponNotice] = useState(true)
  return (
    <Stack>
      <Group justify="space-between" gap={"lg"}>
        <Title size={sm ? "h3" : "h2"} order={2}>
          {t("users.title")}
        </Title>
        <UserModal>
          <Button visibleFrom="md">{t("users.add-button")}</Button>
          <ActionIcon size={"md"} radius={"sm"} hiddenFrom="md">
            <Plus size={18} />
          </ActionIcon>
        </UserModal>
      </Group>

      <Space />
      <Space />

      <Group justify="space-between" gap={"lg"} wrap="nowrap">
        <SearchInput />
        <Group wrap="nowrap">
          <ExportButton queryFun={GetUsers} filename="users" />
          <Filters />
          <DateFilter />
          <CouponFilter />
        </Group>
      </Group>
      <ActiveFiltersBar chips={activeFilterChips} />
      {coupon && showCouponNotice ? (
        <Alert
          color="yellow"
          variant="light"
          icon={<TriangleAlert size={18} />}
          withCloseButton
          onClose={() => setShowCouponNotice(false)}>
          {t("users.coupon-filter-notice")}
        </Alert>
      ) : null}
      <TableCom />
    </Stack>
  )
}

export default Users
