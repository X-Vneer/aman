import { WEBSITE_LANGS } from "@/config"
import { cn } from "@/utils/cn"
import { Group, Radio, ScrollArea, Text } from "@mantine/core"
import { Check } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useTranslation } from "react-i18next"

const LangSwitch = () => {
  const { t } = useTranslation()
  const [lang, setLang] = useQueryState("lang", parseAsString.withDefault("ar"))
  const [completedLangs] = useQueryState("completed-langs", parseAsArrayOf(parseAsString).withDefault([]))
  return (
    <Radio.Group
      value={lang}
      onChange={setLang}
      label={t("general.language")}
      classNames={{
        label: "!text-xl",
      }}>
      <ScrollArea>
        <Group wrap="nowrap" mt="xs" mb={"md"}>
          {WEBSITE_LANGS.map((element) => {
            return (
              <Radio.Card
                key={element}
                miw={190}
                className={cn(
                  "group !duration-150 data-checked:border-secondary data-checked:!bg-[#E8FAFA]",
                  completedLangs.includes(element)
                    ? "border-primary !bg-[var(--mantine-color-primary-0)] !text-primary"
                    : null,
                )}
                radius="8"
                value={element}>
                <Group className="relative py-2" wrap="nowrap" justify="center">
                  <div className="absolute opacity-0">
                    <Radio.Indicator />
                  </div>
                  {completedLangs.includes(element) ? <Check className="text-primary" /> : null}
                  <Text className="group-data-checked:text-secondary">{t(`langs.${element}`)}</Text>
                </Group>
              </Radio.Card>
            )
          })}
        </Group>
      </ScrollArea>
    </Radio.Group>
  )
}

export default LangSwitch
