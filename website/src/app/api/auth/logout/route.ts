import { NextResponse } from "next/server"

import { SESSION_COOKIE } from "@/lib/auth/session"

// Server-side logout for RSC 401 recovery (course page redirects here when
// the Sanctum token has expired — an RSC render cannot mutate cookies, so
// this must be a route handler). GET on purpose: the caller is a redirect().
// The Location header is RELATIVE — deriving an absolute URL from
// request.url behind the nginx proxy would yield http:// and strand the
// Secure session cookie.
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const next = new URL(request.url).searchParams.get("next")
  // Same-site relative paths only — no open redirect, no scheme-relative //host.
  const location = next && next.startsWith("/") && !next.startsWith("//") ? next : "/"

  const response = new NextResponse(null, { status: 307, headers: { Location: location } })
  response.cookies.delete(SESSION_COOKIE)
  return response
}
