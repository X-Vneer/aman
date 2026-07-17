// !!add new lang to middleware matcher in src/proxy.ts
export const LOCALES = ["ar", "en"] as const
export const RTL_LOCALES = ["ar"] as const
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
