import { LOCALES } from "@/config"
import { routing } from "@/lib/i18n/routing"
import { LocaleType } from "@/lib/i18n/types"

export function getLocaleFromUrl(): string {
  const defaultLocale = routing.defaultLocale
  try {
    if (typeof window === "undefined") return ""
    const { pathname } = new URL(window.location.href)
    const pathParts = pathname.split("/").filter(Boolean) // Split and remove empty segments
    const potentialLocale = pathParts[0] as LocaleType[number]

    if (LOCALES.includes(potentialLocale)) {
      return potentialLocale
    }

    return defaultLocale
  } catch (error) {
    console.error("Error parsing URL:", error)
    return defaultLocale
  }
}
