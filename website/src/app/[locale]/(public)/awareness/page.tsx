import { logoWithoutText } from "@/assets"
import Footer from "@/components/common/footer"
import { AmanApiGuest } from "@/services/aman"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { AwarenessResponse } from "./types"
import RenderData from "./components/render-data"
import { getVideos } from "@/services/utils/get-videos"
import { Button } from "@/components/ui/heroui-button"
import { Link } from "@/lib/i18n/navigation"

import { generatePageMetadata } from "@/utils/generate-page-metadata"
import { JsonLd, pageBreadcrumbSchema } from "@/components/common/json-ld"

export const dynamic = "force-dynamic"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  return generatePageMetadata("awareness", locale, "/awareness")
}

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const t = await getTranslations()
  const { videos } = await getVideos()
  const faqs = await AmanApiGuest.get<AwarenessResponse>("/awareness", {
    params: {
      per_page: 1000,
      page: 1,
    },
  })
  const data = faqs.data.data.items.data

  return (
    <>
      <JsonLd data={pageBreadcrumbSchema("awareness", locale, "/awareness")} />
      <main className="relative overflow-hidden">
        <section className="relative z-10 bg-[#0A090959] backdrop-blur-lg">
          <div className="container mx-auto max-w-7xl grow px-6">
            <div className="flex w-full flex-col items-center justify-between md:flex-row md:px-10 lg:px-14 xl:px-20">
              <div className="mx-auto w-full space-y-5 py-16 max-md:max-w-sm max-md:text-center md:py-24 lg:py-32">
                <h1 className="text-foreground text-4xl font-medium">{t("awareness.title")}</h1>
                <p className="text-default-500 pb-10 text-sm">{t("awareness.description")}</p>
                <Link href="/start" className="w-fit">
                  <Button className="rounded-md">{t("awareness.to-programs")}</Button>
                </Link>
              </div>
              <div className="md:w-1/2"></div>
            </div>
          </div>
        </section>
        <div className="absolute inset-0 max-md:hidden">
          <div className="container mx-auto max-w-7xl grow px-6">
            <div className="flex w-full flex-col items-center justify-between gap-5 md:flex-row md:gap-10 md:px-10 lg:px-14 xl:px-20">
              <div className="md:w-1/2"></div>
              <div className="relative flex w-full items-center justify-center py-12 md:w-1/2">
                <Image src={logoWithoutText} alt="aman" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <RenderData data={data} videos={videos} />
      <Footer />
    </>
  )
}
