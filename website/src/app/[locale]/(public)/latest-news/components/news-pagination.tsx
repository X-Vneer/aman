import { Link } from "@/lib/i18n/navigation"
import { getTranslations } from "next-intl/server"

import { newsListingHref, getNewsPaginationPages } from "../pagination-utils"

type NewsPaginationProps = {
  currentPage: number
  lastPage: number
  from: number | null
  to: number | null
  total: number
}

export async function NewsPagination({ currentPage, lastPage, from, to, total }: NewsPaginationProps) {
  const t = await getTranslations("latest-news.pagination")
  if (lastPage <= 1 || total === 0) return null

  const fromN = from ?? 0
  const toN = to ?? 0
  const pages = getNewsPaginationPages(currentPage, lastPage)
  const linkClass =
    "text-default-300 hover:text-foreground inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 bg-[#121110] px-3 text-sm font-medium transition-colors hover:border-white/20"
  const activeClass = "border-white/25 bg-white/10 text-foreground pointer-events-none"
  const navClass = `${linkClass} gap-1.5 px-3`
  const navDisabledClass = `${navClass} text-default-500 cursor-not-allowed opacity-40`

  return (
    <nav
      className="border-default-400/20 mt-12 flex w-full flex-col items-stretch gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between"
      aria-label={t("navLabel")}>
      <p className="text-default-400 text-center text-sm sm:text-start">
        {t("summary", { from: fromN, to: toN, total })}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {currentPage <= 1 ? (
          <span className={navDisabledClass}>{t("previous")}</span>
        ) : (
          <Link href={newsListingHref(currentPage - 1)} className={navClass}>
            {t("previous")}
          </Link>
        )}
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {pages.map((p, i) =>
            p === "ellipsis" ? (
              <li key={`e-${i}`} className="text-default-500 px-1 select-none" aria-hidden>
                …
              </li>
            ) : (
              <li key={p}>
                <Link
                  href={newsListingHref(p)}
                  className={`${linkClass} ${p === currentPage ? activeClass : ""}`}
                  aria-current={p === currentPage ? "page" : undefined}>
                  {p}
                </Link>
              </li>
            ),
          )}
        </ul>
        {currentPage >= lastPage ? (
          <span className={navDisabledClass}>{t("next")}</span>
        ) : (
          <Link href={newsListingHref(currentPage + 1)} className={navClass}>
            {t("next")}
          </Link>
        )}
      </div>
    </nav>
  )
}
