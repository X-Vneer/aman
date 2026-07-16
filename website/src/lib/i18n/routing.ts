import { LOCALES } from "@/config"
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: LOCALES[0],
  localePrefix: "always",
})
