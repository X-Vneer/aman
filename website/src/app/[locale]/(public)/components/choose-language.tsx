"use client"

import { LOCALES } from "@/config"
import { Tabs } from "@heroui/react"
import { Ripple } from "m3-ripple"
import { useTranslations } from "next-intl"
import { parseAsStringLiteral, useQueryState } from "nuqs"

import { urdu } from "@/config/fonts"
import { cn } from "@/lib/cn"
import { useParams } from "next/navigation"

type Props = {}

const ChooseLanguage = (props: Props) => {
  const t = useTranslations("choose-language.tabs")
  const params = useParams() as { locale: (typeof LOCALES)[number] }

  const [language, setLanguage] = useQueryState(
    "language",
    parseAsStringLiteral(LOCALES).withDefault(params.locale || "ar"),
  )

  return (
    <div className="flex justify-center">
      <Tabs
        selectedKey={language}
        onSelectionChange={(key) => setLanguage(key as (typeof LOCALES)[number])}
        variant="secondary"
        className="gap-1"
        aria-label="Tabs variants">
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Language"
            className="*:data-[selected=true]:text-primary gap-1 *:h-auto *:min-h-9 *:px-2 *:py-1 *:text-xs *:font-normal sm:*:px-3 sm:*:text-sm md:*:text-base">
            {LOCALES.map((element) => (
              <Tabs.Tab
                key={element}
                id={element}
                className={cn(
                  "max-md:px-1.5 max-sm:px-1",
                  element === "ur" ? urdu.className : "",
                )}>
                <Ripple />
                {t(element)}
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
        {LOCALES.map((element) => (
          <Tabs.Panel key={`panel-${element}`} id={element} className="sr-only" aria-hidden>
            <span className="sr-only">{t(element)}</span>
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  )
}

export default ChooseLanguage
