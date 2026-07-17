import createMiddleware from "next-intl/middleware"
import { NextRequest } from "next/server"
import { routing } from "./lib/i18n/routing"

// Main middleware
export default function middleware(request: NextRequest) {
  // 5. For non-API routes, apply Next.js i18n middleware (this handles routing and locale)
  const response = createMiddleware(routing)(request)

  return response
}

export const config = {
  // Match all routes including API routes (but we'll handle them differently)
  matcher: ["/", `/(ar|en)/:path*`],
}
