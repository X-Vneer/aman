import { useSmallScreen } from "@/hooks/use-small-screen"
import { cn } from "@/utils/cn"
import { Button, Popover, Stack, TextInput } from "@mantine/core"
import { SlidersHorizontal } from "lucide-react"
import { parseAsString, useQueryStates } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const UserFilter = () => {
  const { t } = useTranslation()

  const [filters, setFilters] = useQueryStates({
    user_name: parseAsString.withDefault(""),
    user_mobile: parseAsString.withDefault(""),
    user_email: parseAsString.withDefault(""),
  })

  const [state, setState] = useState({
    user_name: filters.user_name || "",
    user_mobile: filters.user_mobile || "",
    user_email: filters.user_email || "",
  })

  const handleApplyFilters = () => {
    if (!state.user_name.trim() && !state.user_mobile.trim() && !state.user_email.trim()) {
      setFilters({
        user_name: null,
        user_mobile: null,
        user_email: null,
      })
      return
    }
    setFilters({
      user_name: state.user_name.trim() || null,
      user_mobile: state.user_mobile.trim() || null,
      user_email: state.user_email.trim() || null,
    })
  }

  const hasActiveFilters = filters.user_name || filters.user_mobile || filters.user_email

  const sm = useSmallScreen()
  return (
    <Popover width={sm ? 220 : 300} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className={cn("border! border-gray-300!", hasActiveFilters && "border-secondary!")}
          color="#5A5A5A"
          size={sm ? "xs" : "sm"}
          leftSection={<SlidersHorizontal size={sm ? 17 : 20} />}>
          {t("users.table.user")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="border-none!">
        <Stack gap={"sm"}>
          <TextInput
            size="xs"
            value={state.user_name}
            onChange={(e) => setState((prev) => ({ ...prev, user_name: e.target.value }))}
            label={t("users.table.name")}
            placeholder={t("users.table.name")}
          />
          <TextInput
            size="xs"
            value={state.user_mobile}
            onChange={(e) => setState((prev) => ({ ...prev, user_mobile: e.target.value }))}
            label={t("users.form.mobile-input-label")}
            placeholder={t("users.form.mobile-input-placeholder")}
          />
          <TextInput
            size="xs"
            value={state.user_email}
            onChange={(e) => setState((prev) => ({ ...prev, user_email: e.target.value }))}
            label={t("reviews.filters.email-input-label")}
            placeholder={t("reviews.filters.email-input-label")}
            type="email"
          />

          <Button size="sm" onClick={handleApplyFilters}>
            {t("global.apply")}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default UserFilter
