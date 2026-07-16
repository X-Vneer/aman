import Footer from "@/components/common/footer"
import { CalendarDays } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { JsonLd, breadcrumbSchema, homeLabel, localizedCrumb } from "@/components/common/json-ld"
import { buildLocaleAlternates } from "@/utils/generate-page-metadata"

import { formatNewsPublishDate } from "../components/card"
import { getNewsItem } from "../index"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, slug } = await props.params
  const alternates = buildLocaleAlternates(`/latest-news/${slug}`, locale)
  const news = await getNewsItem(slug)
  if (!news) return { title: "Latest News", alternates }
  return {
    title: news.title,
    description: news.short_description,
    keywords: news.tags.map((e) => e.name),
    alternates,
    openGraph: {
      title: news.title,
      description: news.short_description,
      url: alternates.canonical,
      locale,
      ...(news.logo ? { images: [{ url: news.logo }] } : {}),
    },
  }
}

export default async function Page(props: Props) {
  const { locale, slug } = await props.params
  const news = await getNewsItem(slug)
  if (!news) notFound()

  const dateLabel = formatNewsPublishDate(news.publish_date, locale)

  const crumbs = breadcrumbSchema(
    [
      { name: homeLabel(locale), path: "" },
      { name: localizedCrumb("latest-news", locale), path: "/latest-news" },
      { name: news.title, path: `/latest-news/${slug}` },
    ],
    locale,
  )

  return (
    <>
      <JsonLd data={crumbs} />
      <main className="min-h-screen bg-[#121212]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="mb-8 text-4xl leading-tight font-bold text-white md:text-5xl">{news.title}</h1>

          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-white">
              <CalendarDays className="size-4 shrink-0" aria-hidden />
              <time dateTime={news.publish_date}>{dateLabel}</time>
            </div>
            {news.tags.length > 0 ? (
              <ul className="flex list-none flex-wrap justify-end gap-2 p-0">
                {news.tags.map((tag) => (
                  <li key={tag.id}>
                    <span className="inline-block rounded-full border border-gray-600 px-3 py-1 text-[10px] tracking-wider text-gray-300 uppercase">
                      {tag.name}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element -- remote CMS image URL */}
          <img src={news.logo} alt={news.title} className="my-10 w-full rounded-xl object-contain" />

          <article
            className={[
              "prose prose-invert max-w-none",
              "prose-headings:text-white prose-headings:font-semibold",
              "prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline",
              "prose-strong:text-gray-200",
              "prose-ul:text-gray-400 prose-ol:text-gray-400 prose-li:marker:text-gray-500",
              "prose-blockquote:border-gray-600 prose-blockquote:text-gray-300",
              "prose-code:text-gray-200",
              "prose-p:text-base prose-p:leading-relaxed prose-p:text-gray-400 prose-p:mb-6",
              "[&_p:first-of-type]:mb-8 [&_p:first-of-type]:text-2xl [&_p:first-of-type]:leading-relaxed [&_p:first-of-type]:text-white",
              "prose-img:rounded-xl",
            ].join(" ")}
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
