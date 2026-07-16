import { WEBSITE_LANGS } from "@/config"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { cn } from "@/utils/cn"
import { Button, Checkbox, Popover, Stack } from "@mantine/core"
import { SlidersHorizontal } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const LangFilter = () => {
  const { t } = useTranslation()

  const [langs, setLangs] = useQueryState("langs[]", parseAsArrayOf(parseAsString).withDefault([]))
  const [state, setState] = useState<string[]>(langs)
  const handleApplyFilters = () => {
    setLangs(state)
  }

  const sm = useSmallScreen()
  return (
    <Popover width={sm ? 200 : 250} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className={cn("!border !border-gray-300", langs.length !== 0 && "!border-secondary")}
          color="#5A5A5A"
          size={sm ? "xs" : "sm"}
          leftSection={<SlidersHorizontal size={sm ? 17 : 20} />}>
          {t("global.lang")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="!border-none">
        <Stack gap={"sm"}>
          <Checkbox.Group value={state} onChange={setState} label={t("users.filters.langs.title")}>
            <Stack gap={"sm"} mt="xs">
              {WEBSITE_LANGS.map((lang) => (
                <Checkbox
                  key={lang}
                  radius={"sm"}
                  size="sm"
                  color="secondary"
                  value={lang}
                  label={t(`langs.${lang}`)}
                />
              ))}
            </Stack>
          </Checkbox.Group>

          <Button size="sm" onClick={handleApplyFilters}>
            {t("global.apply")}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default LangFilter
