import type { Session } from "./types"

// AES-256-GCM sealed session cookie. This module must stay poison-free
// (no top-level next/headers, node:crypto, or server-only imports): it is
// reachable from the client-component graph through aman.ts's dynamic
// import, and Turbopack traverses dynamic-import edges. All server-only
// modules are imported lazily inside the functions, which never run in
// the browser (the aman.ts client branch never calls them).

export const SESSION_COOKIE = "aman_session"

export const COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
  // Secure only over HTTPS, derived from the site scheme: a Secure cookie is
  // silently dropped by the browser on plain HTTP, which would break login on
  // an HTTP deployment. Flips on automatically once NEXT_PUBLIC_SITE_URL is https.
  secure: (process.env.NEXT_PUBLIC_SITE_URL || "").startsWith("https"),
  maxAge: 60 * 60 * 24 * 30, // 30 days
} as const

// Lazy so a missing AUTH_SECRET fails loudly on first real use (request
// time, server-side) instead of at module evaluation, which would break
// `next build` on machines without .env.local.
async function getKey() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET is not set — required to seal/unseal the session cookie")
  const { createHash } = await import("node:crypto")
  return createHash("sha256").update(secret).digest()
}

/** Encrypt a session into an opaque cookie value: base64url(iv | authTag | ciphertext). */
export async function seal(session: Session): Promise<string> {
  const { randomBytes, createCipheriv } = await import("node:crypto")
  const key = await getKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", key, iv)
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(session), "utf8"), cipher.final()])
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString("base64url")
}

/** Decrypt a cookie value. Returns null on any tamper/parse/legacy-cookie failure. */
export async function unseal(raw: string): Promise<Session | null> {
  try {
    const { createDecipheriv } = await import("node:crypto")
    const key = await getKey()
    const buf = Buffer.from(raw, "base64url")
    if (buf.length < 29) return null
    const iv = buf.subarray(0, 12)
    const authTag = buf.subarray(12, 28)
    const ciphertext = buf.subarray(28)
    const decipher = createDecipheriv("aes-256-gcm", key, iv)
    decipher.setAuthTag(authTag)
    const json = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8")
    const session = JSON.parse(json) as Session
    return session?.user?.token ? session : null
  } catch {
    return null
  }
}

/**
 * Read the session in any server context (RSC, route handler, server action,
 * the aman.ts server branch). Returns null when logged out, when the cookie
 * is invalid, or outside a request scope (generateMetadata, sitemaps) —
 * but rethrows Next's control-flow errors (e.g. the dynamic-rendering
 * bailout during prerender) so pages that read the session stay dynamic.
 */
export async function getSession(): Promise<Session | null> {
  try {
    const { cookies } = await import("next/headers")
    const raw = (await cookies()).get(SESSION_COOKIE)?.value
    return raw ? await unseal(raw) : null
  } catch (error) {
    const { unstable_rethrow } = await import("next/navigation")
    unstable_rethrow(error)
    return null
  }
}
