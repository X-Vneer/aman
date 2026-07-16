import Footer from "@/components/common/footer"
import { CalendarDays } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { buildLocaleAlternates } from "@/utils/generate-page-metadata"
import { JsonLd, breadcrumbSchema, localizedCrumb, homeLabel } from "@/components/common/json-ld"

import { formatBlogPublishDate } from "../components/card"
import { getBlog } from "../index"

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, slug } = await props.params
  const alternates = buildLocaleAlternates(`/blog/${slug}`, locale)
  const blog = await getBlog(slug)
  if (!blog) return { title: "Blog", alternates }
  return {
    title: blog.title,
    description: blog.short_description,
    alternates,
    openGraph: {
      title: blog.title,
      description: blog.short_description,
      url: alternates.canonical,
      locale,
      ...(blog.logo ? { images: [{ url: blog.logo }] } : {}),
    },
  }
}

export default async function Page(props: Props) {
  const { locale, slug } = await props.params
  const blog = await getBlog(slug)
  if (!blog) notFound()

  const dateLabel = formatBlogPublishDate(blog.publish_date, locale)

  const crumbs = breadcrumbSchema(
    [
      { name: homeLabel(locale), path: "" },
      { name: localizedCrumb("blog", locale), path: "/blog" },
      { name: blog.title, path: `/blog/${slug}` },
    ],
    locale,
  )

  return (
    <>
      <JsonLd data={crumbs} />
      <main className="min-h-screen bg-[#121212]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <h1 className="mb-8 text-4xl leading-tight font-bold text-white md:text-5xl">{blog.title}</h1>

          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-white">
              <CalendarDays className="size-4 shrink-0" aria-hidden />
              <time dateTime={blog.publish_date}>{dateLabel}</time>
            </div>
            {blog.tags.length > 0 ? (
              <ul className="flex list-none flex-wrap justify-end gap-2 p-0">
                {blog.tags.map((tag) => (
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
          <img src={blog.logo} alt={blog.title} className="my-10 w-full rounded-xl object-contain" />

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
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
