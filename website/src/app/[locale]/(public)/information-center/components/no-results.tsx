"use client"
import { noResults } from "@/assets"
import { useTranslations } from "next-intl"

type Props = {}

const NoResults = (props: Props) => {
  const t = useTranslations("information-center.search")
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 py-20 md:py-24 lg:py-32">
      <img src={noResults.src} alt="no results" className="shrink-0" />
      <p className="text-default-500 max-w-[250px] text-center text-sm leading-normal">{t("no-results")}</p>
    </div>
  )
}

export default NoResults
