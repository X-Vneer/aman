import { NextResponse } from "next/server"

import { getSession } from "@/lib/auth/session"

// Consumed only by the client session store (src/lib/auth/session-client.ts).
// Returns the session JSON, or null body when logged out.
export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(await getSession())
}
