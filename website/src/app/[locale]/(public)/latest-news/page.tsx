import { logoWithoutText } from "@/assets"
import Footer from "@/components/common/footer"
import { redirect } from "@/lib/i18n/navigation"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

import { getNewsList } from "./index"
import { NewsCard } from "./components/card"
import { NewsPagination } from "./components/news-pagination"
import { parseNewsPageParam } from "./pagination-utils"

import { generatePageMetadata } from "@/utils/generate-page-metadata"
import { JsonLd, pageBreadcrumbSchema } from "@/components/common/json-ld"

export const dynamic = "force-dynamic"

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  return generatePageMetadata("latest-news", locale, "/latest-news")
}

const NEWS_PAGE_SIZE = 9

export default async function Page(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const t = await getTranslations("latest-news")

  const requestedPage = parseNewsPageParam(searchParams.page)
  const { news, meta } = await getNewsList({ per_page: NEWS_PAGE_SIZE, page: requestedPage })

  if (meta.last_page > 0 && requestedPage > meta.last_page) {
    redirect({
      href:
        meta.last_page <= 1
          ? "/latest-news"
          : {
              pathname: "/latest-news",
              query: { page: String(meta.last_page) },
            },
      locale: params.locale,
    })
  }

  if (meta.total === 0 && requestedPage > 1) {
    redirect({ href: "/latest-news", locale: params.locale })
  }

  return (
    <>
      <JsonLd data={pageBreadcrumbSchema("latest-news", params.locale, "/latest-news")} />
      <main className="relative">
        <section className="relative z-10 bg-[#0A090959] backdrop-blur-lg">
          <div className="container mx-auto max-w-7xl grow px-6">
            <div className="flex w-full flex-col items-center justify-between md:flex-row md:px-10 lg:px-14 xl:px-20">
              <div className="max-w-sm space-y-5 py-16 max-md:mx-auto max-md:max-w-xs max-md:text-center md:py-24 lg:py-32">
                <h1 className="text-foreground text-4xl font-medium">{t("title")}</h1>
                <p className="text-default-500 pb-10 text-sm">{t("description")}</p>
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

        <section className="relative py-12 lg:py-20">
          <div className="container mx-auto max-w-7xl px-6">
            {news.length === 0 ? (
              <p className="text-default-500 text-center text-sm">{t("empty")}</p>
            ) : (
              <>
                <ul className="grid list-none gap-6 md:grid-cols-2">
                  {news.map((item) => (
                    <li key={item.id}>
                      <NewsCard news={item} locale={params.locale} href={`/latest-news/${item.slug}`} />
                    </li>
                  ))}
                </ul>
                <NewsPagination
                  currentPage={meta.current_page}
                  lastPage={meta.last_page}
                  from={meta.from}
                  to={meta.to}
                  total={meta.total}
                />
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
