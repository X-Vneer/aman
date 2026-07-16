import Footer from "@/components/common/footer"
import { AmanApiGuest } from "@/services/aman"
import GetRandom from "@/utils/get-random"
import { Card } from "@heroui/react"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import List from "./components/list"
import { FAQResponse } from "./types"
import { routing } from "@/lib/i18n/routing"

import { generatePageMetadata } from "@/utils/generate-page-metadata"
import { JsonLd, pageBreadcrumbSchema } from "@/components/common/json-ld"

export const revalidate = 86400 // 1 day in seconds (24 hours)
export const dynamic = "force-static"
export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  return generatePageMetadata("faqs", locale, "/faqs")
}
export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params

  const { locale } = params

  // Enable static rendering
  setRequestLocale(locale)
  const t = await getTranslations("faqs")
  const faqs = await AmanApiGuest.get<FAQResponse>("/faqs", {
    params: {
      per_page: 100,
      page: 1,
    },
  })
  const data = faqs.data.data.items.data

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.map((faq) => ({
      "@type": "Question",
      name: faq.title,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.description,
      },
    })),
  }

  const jsonLd = JSON.stringify(faqSchema).replace(/</g, "\\u003c")

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <JsonLd data={pageBreadcrumbSchema("faqs", locale, "/faqs")} />
      <main className="container mx-auto max-w-7xl grow px-6 pt-5 md:pt-8 lg:pt-10">
        <section className="flex items-center justify-center gap-4 py-16 md:py-20 lg:py-24">
          <Card className="w-full max-w-3xl shrink-0 rounded-xl bg-[#0A090959] p-1">
            <div className="mb-3 space-y-1 rounded-t-lg bg-[#1D1B1B] px-7 py-5 md:px-9 md:py-7 lg:px-12 lg:py-9">
              <h1 className="text-xl lg:text-2xl">{t("title")}</h1>
              <p className="text-default-500 text-sm">{t("description")}</p>
            </div>
            <List data={data} />
          </Card>
        </section>
      </main>
      <Footer />
    </>
  )
}
