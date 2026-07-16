import Footer from "@/components/common/footer"
import type { Metadata } from "next"
import StoriesForm from "./components/form"
import Hero from "./components/hero"
import Stories from "./components/stories"

import { generatePageMetadata } from "@/utils/generate-page-metadata"
import { JsonLd, pageBreadcrumbSchema } from "@/components/common/json-ld"

export const dynamic = "force-dynamic"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  return generatePageMetadata("stories", locale, "/stories")
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  return (
    <>
      <JsonLd data={pageBreadcrumbSchema("stories", locale, "/stories")} />
      <Hero />
      <StoriesForm />
      <Stories />
      <Footer />
    </>
  )
}
