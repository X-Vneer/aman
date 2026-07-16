import { Card } from "@heroui/react"
import { Separator } from "@heroui/react"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Suspense } from "react"
import Search from "./components/search"
import SearchResults from "./components/search-results"

import { generatePageMetadata } from "@/utils/generate-page-metadata"
import { JsonLd, pageBreadcrumbSchema } from "@/components/common/json-ld"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  return generatePageMetadata("information-center", locale, "/information-center")
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params
  const { locale } = params
  const t = await getTranslations("information-center")
  setRequestLocale(locale)
  return (
    <>
      <JsonLd data={pageBreadcrumbSchema("information-center", locale, "/information-center")} />
      <section className="flex items-center justify-center gap-4 py-16 md:py-20 lg:py-24">
        <Card className="w-full max-w-3xl shrink-0 rounded-xl bg-[#0A090959] p-1">
          <div className="mb-3 space-y-1 rounded-t-lg bg-[#1D1B1B] px-7 py-5 md:px-9 md:py-7 lg:px-12 lg:py-9">
            <h1 className="text-xl lg:text-2xl">{t("title")}</h1>
            <p className="text-default-500 text-sm">{t("description")}</p>
          </div>
          <div className="space-y-4 px-6 py-5 md:space-y-6 md:px-10 md:py-6 lg:space-y-8 lg:px-16 lg:py-7">
            <Suspense fallback={null}>
              <Search />
            </Suspense>
            <Separator />
            <Suspense fallback={null}>
              <SearchResults />
            </Suspense>
          </div>
        </Card>
      </section>
    </>
  )
}
