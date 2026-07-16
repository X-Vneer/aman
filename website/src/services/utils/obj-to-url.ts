interface UrlObject {
  href:
    | string // href can be a simple string
    | {
        pathname: string
        query?: Record<string, any>
      }
  locale?: string
}

export function objectToUrl(obj: UrlObject): string {
  const { href, locale } = obj

  if (typeof href === "string") {
    // If href is a simple string, add locale directly
    return locale ? `/${locale}${href}` : href
  }

  const { pathname, query } = href

  // Construct the base URL with the locale
  const baseUrl = locale ? `/${locale}${pathname}` : pathname

  // Build the query string from the query object
  const queryString = query
    ? Object.entries(query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&")
    : ""

  // Combine base URL with query string
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}
