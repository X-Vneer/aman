export function parseNewsPageParam(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value
  const n = Number.parseInt(raw ?? "1", 10)
  if (!Number.isFinite(n) || n < 1) return 1
  return Math.floor(n)
}

export function getNewsPaginationPages(current: number, lastPage: number): (number | "ellipsis")[] {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, i) => i + 1)
  }
  const pages: (number | "ellipsis")[] = []
  pages.push(1)
  if (current > 3) pages.push("ellipsis")
  const start = Math.max(2, current - 1)
  const end = Math.min(lastPage - 1, current + 1)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  if (current < lastPage - 2) pages.push("ellipsis")
  pages.push(lastPage)
  return pages
}

export function newsListingHref(page: number): string | { pathname: string; query: { page: string } } {
  if (page <= 1) return "/latest-news"
  return { pathname: "/latest-news", query: { page: String(page) } }
}
