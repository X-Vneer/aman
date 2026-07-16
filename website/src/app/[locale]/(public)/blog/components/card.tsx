import { Link } from "@/lib/i18n/navigation"
import { Card, Chip } from "@heroui/react"
import { ArrowUpRight, CalendarDays } from "lucide-react"

import type { Blog } from "../types"

const INTL_LOCALE_BY_APP: Record<string, string> = {
  ar: "ar-SA",
  en: "en-US",
  fr: "fr-FR",
  fil: "fil-PH",
  id: "id-ID",
  ur: "ur-PK",
}

export function formatBlogPublishDate(publishDate: string, locale: string) {
  const d = new Date(publishDate)
  if (Number.isNaN(d.getTime())) return publishDate
  const tag = INTL_LOCALE_BY_APP[locale] ?? locale
  return new Intl.DateTimeFormat(tag, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d)
}

export type BlogCardProps = {
  blog: Blog
  href: string
  locale: string
}

export function BlogCard({ blog, href, locale }: BlogCardProps) {
  const dateLabel = formatBlogPublishDate(blog.publish_date, locale)

  return (
    <Link href={href} className="group block">
      <Card
        style={{
          boxShadow: "6.03px 6.03px 48.27px 0px #00000014",
          border: "1px solid #E5E7EB",
        }}
        className="flex aspect-6/5 w-full flex-col justify-end gap-0 overflow-hidden rounded-[24px] p-0!">
        <img src={blog.logo} alt={blog.title} className="absolute inset-0 h-full w-full object-cover" />

        <div className="relative flex flex-col gap-4 bg-[#0a0a0a58] p-4 pt-6 text-white backdrop-blur-lg">
          <Card.Header className="">
            <div className="flex items-center justify-between">
              <Card.Title className="line-clamp-1 truncate text-lg leading-normal font-semibold">
                {blog.title}
              </Card.Title>
              <ArrowUpRight
                className="size-5 shrink-0 stroke-[1.5] text-white/70 transition-colors group-hover:text-white"
                aria-hidden
              />
            </div>
            <Card.Description className="mt-2 line-clamp-1 text-xs leading-relaxed text-white!">
              {blog.short_description}
            </Card.Description>
          </Card.Header>

          <Card.Footer className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full border-[0.7px] border-white"
                aria-hidden>
                <CalendarDays strokeWidth={1.5} className="size-5" />
              </span>
              <time className="text-xs font-semibold" dateTime={blog.publish_date}>
                {dateLabel}
              </time>
            </div>

            <div>
              {blog.tags.length > 0 ? (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {blog.tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      size="sm"
                      variant="secondary"
                      color="default"
                      className="rounded-[12px]! border-[0.7px] border-white bg-transparent text-[10px] font-medium text-white/90">
                      <Chip.Label>{tag.name}</Chip.Label>
                    </Chip>
                  ))}
                </div>
              ) : null}
            </div>
          </Card.Footer>
        </div>
      </Card>
    </Link>
  )
}
