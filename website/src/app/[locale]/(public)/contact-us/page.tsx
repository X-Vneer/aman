import { Card } from "@heroui/react"
import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import ContactForm from "./components/form"

import { generatePageMetadata } from "@/utils/generate-page-metadata"
import { JsonLd, pageBreadcrumbSchema } from "@/components/common/json-ld"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  return generatePageMetadata("contact-us", locale, "/contact-us")
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params
  const { locale } = params
  setRequestLocale(locale)
  const t = await getTranslations("contact-us")
  const description = t("description")
  const phoneNumber = "+966 53 367 3587"
  const whatsappUrl = "https://wa.me/966533673587"

  // Split description and make phone number clickable
  const renderDescription = () => {
    const parts = description.split(phoneNumber)
    if (parts.length === 2) {
      return (
        <>
          {parts[0]}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="text-primary hover:underline">
            {phoneNumber}
          </a>
          {parts[1]}
        </>
      )
    }
    return description
  }

  return (
    <>
      <JsonLd data={pageBreadcrumbSchema("contact-us", locale, "/contact-us")} />
      <section className="flex items-center justify-center gap-4 py-16 md:py-20 lg:py-24">
        <Card className="w-full max-w-3xl shrink-0 rounded-xl bg-[#0A090959] p-1">
          <div className="mb-3 space-y-1 rounded-t-lg bg-[#1D1B1B] px-7 py-5 md:px-9 md:py-7 lg:px-12 lg:py-9">
            <h1 className="text-xl lg:text-2xl">{t("title")}</h1>
            <p className="text-default-500 text-sm">{renderDescription()}</p>
          </div>
          <div className="space-y-4 px-6 py-5 md:space-y-6 md:px-10 md:py-6 lg:space-y-8 lg:px-16 lg:py-7">
            <ContactForm />
          </div>
        </Card>
      </section>
    </>
  )
}
