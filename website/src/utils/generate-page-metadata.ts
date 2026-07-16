import type { Metadata } from "next"

import { SITE_URL } from "@/config"
import { getPageMeta, type PageMetaKey } from "@/config/page-meta"
import { routing } from "@/lib/i18n/routing"

export function buildLocaleAlternates(path: string, currentLocale: string) {
  const baseUrl = SITE_URL.replace(/\/$/, "")
  const normalizedPath = path === "" || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${baseUrl}/${l}${normalizedPath}`
  }
  languages["x-default"] = `${baseUrl}/${routing.defaultLocale}${normalizedPath}`

  return {
    canonical: `${baseUrl}/${currentLocale}${normalizedPath}`,
    languages,
  }
}

export function generatePageMetadata(key: PageMetaKey, locale: string, path: string): Metadata {
  const { title, description } = getPageMeta(key, locale)
  const { canonical, languages } = buildLocaleAlternates(path, locale)

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
