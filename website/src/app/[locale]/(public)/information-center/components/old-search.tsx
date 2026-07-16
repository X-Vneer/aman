"use client"
import { useLocalStorage } from "@mantine/hooks"
import { Button } from "@/components/ui/heroui-button"
import { ArrowUpLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import { parseAsString, useQueryState } from "nuqs"

type Props = {}

const OldSearch = (props: Props) => {
  const t = useTranslations("information-center.search")
  const [values, setValues] = useLocalStorage<string[]>({
    key: "information-center-previous-search",
    defaultValue: [],
  })
  const handleClearHistory = () => {
    setValues([])
  }

  const [_, setQuery] = useQueryState("q", parseAsString.withDefault(""))
  if (values.length === 0) return null
  return (
    <>
      <div>
        <div className="flex w-full items-center justify-between">
          <p className="text-sm text-default-500">{t("old-search")}</p>
          <Button onPress={handleClearHistory} variant="ghost" className="text-primary">
            {t("clear-history")}
          </Button>
        </div>
        {values.filter(Boolean).map((result, i) => (
          <div
            onClick={() => {
              setQuery(result)
            }}
            key={result}
            className="flex items-center justify-between gap-4 rounded-md p-2 px-4 duration-200 hover:bg-default-200/50">
            <span className="text-default-500">{result}</span>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border md:size-10 lg:size-12">
              <ArrowUpLeft className="size-4 text-primary md:size-5 lg:size-6" strokeWidth={1.1} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default OldSearch
