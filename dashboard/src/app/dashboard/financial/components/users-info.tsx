import ActiveFiltersBar from "@/components/common/active-filters-bar"
import { useFinancialUsersActiveFilterChips } from "@/hooks/use-dashboard-active-filter-chips"
import { Group, Space, Stack } from "@mantine/core"
import SearchInput from "@/components/ui/search-input"
import ExportButton from "@/components/common/export-button"
import CouponFilter from "../../reports/components/coupon-filter"
import UsersTable from "./table"
import { GetUsersInfo } from "../get-financial"
import CouponPresenceFilter from "./coupon-presence-filter"
import PaymentStatusFilter from "./payment-status-filter"

const UsersInfo = () => {
  const activeFilterChips = useFinancialUsersActiveFilterChips()
  return (
    <Stack>
      <Space />
      <Space />
      {/* 
      <Group justify="space-between" gap={"lg"}>
        <Title size={sm ? "h4" : "h3"} order={2}>
          {t("users-info.title")}
        </Title>
      </Group> */}

      <Group wrap="wrap" gap="sm">
        <Group justify="space-between" className="min-w-0 grow" wrap="nowrap">
          <SearchInput />
          <ExportButton permissionKey="Financial:Export" queryFun={GetUsersInfo} filename="users" />
        </Group>
        <Group wrap="wrap" gap="sm">
          <PaymentStatusFilter />
          <CouponFilter />
          <CouponPresenceFilter />
        </Group>
      </Group>
      <ActiveFiltersBar chips={activeFilterChips} />
      <UsersTable />
    </Stack>
  )
}

export default UsersInfo
