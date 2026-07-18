import type { Session } from "@/lib/auth/types"
import { getLocaleFromUrl } from "@/utils/get-locale"
import axios from "axios"
import { getLocale } from "next-intl/server"

export const baseURL = process.env.NEXT_PUBLIC_API_URL

// Create an Axios instance`
const AmanApi = axios.create({
  baseURL: baseURL,
})
// Create an Axios instance
export const AmanApiGuest = axios.create({
  baseURL: baseURL + "/guest",
})

// Add a request interceptor to include the authentication token
AmanApi.interceptors.request.use(
  async (config) => {
    // console.log("🚀 ~ config:", config.baseURL, config.url, config.data)
    let session: null | Session = null
    if (typeof window === "undefined") {
      const locale = await getLocale()
      config.headers["Accept-language"] = locale

      // Server-side — dynamic import keeps server-only code out of the client bundle
      const { getSession } = await import("@/lib/auth/session")
      session = await getSession()
    } else {
      // Client-side
      const { getClientSession } = await import("@/lib/auth/session-client")
      session = await getClientSession()
      const locale = getLocaleFromUrl()
      // if (!config.data.headers["Accept-language"]) {
      config.headers["Accept-language"] = locale
      // }
    }

    if (session && session?.user?.token) {
      config.headers["Authorization"] = `Bearer ${session.user.token}`
    }

    return config
  },
  async (error) => {
    return Promise.reject(error)
  },
)

// Add a request interceptor to include the authentication token
AmanApiGuest.interceptors.request.use(
  async (config) => {
    // console.log("🚀 ~ config:", config.baseURL, config.url, config.data)
    if (typeof window === "undefined") {
      const locale = await getLocale()
      config.headers["Accept-language"] = locale
    } else {
      const locale = getLocaleFromUrl()
      // if (!config.data.headers["Accept-language"]) {
      config.headers["Accept-language"] = locale
      // }
    }

    return config
  },
  async (error) => {
    // Do something with request error

    return Promise.reject(error)
  },
)

export default AmanApi
