import { Spinner } from "@heroui/react"
import { useTranslations } from "next-intl"

export default function Loading() {
  const t = useTranslations("")
  // loading page
  return (
    <div className="flex h-svh w-full flex-col items-center justify-center gap-4 text-center">
      <Spinner />
      <p className="text-primary text-sm">{t("certificate.loading")}</p>
    </div>
  )
}
