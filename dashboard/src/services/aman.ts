import i18n from "@/lib/i18n"
import { getSession } from "@/utils/get-session"
import { logout } from "@/utils/logout"
import axios from "axios"

const productionBaseURL = "https://uat.api.inaash.edu.sa"
// Environment-based API URL configuration
const getBaseURL = () => {
  // Use environment variable if set (for production/staging builds)
  // This is set during build time via deploy.yml
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "") // Remove trailing slash
  }

  // Check for staging API URL (from .env)
  if (import.meta.env.VITE_STAGING_API_BASE_URL) {
    return import.meta.env.VITE_STAGING_API_BASE_URL.replace(/\/$/, "") // Remove trailing slash
  }

  // For local development
  if (import.meta.env.VITE_LOCAL_API_BASE_URL) {
    return import.meta.env.VITE_LOCAL_API_BASE_URL.replace(/\/$/, "") // Remove trailing slash
  }

  // Fallback to production URL
  return productionBaseURL
}

const baseURL = getBaseURL()

// Create an Axios instance
const AmanApi = axios.create({
  baseURL: baseURL + "/admin",
})
// Create an Axios instance
export const AmanApiGuest = axios.create({
  baseURL: baseURL + "/guest/admin",
})

// Add a request interceptor to include the authentication token
AmanApi.interceptors.request.use(
  async (config) => {
    const session = getSession()
    const locale = i18n.language
    // if (!config.data.headers["Accept-language"]) {
    config.headers["Accept-language"] = locale
    // }

    // turn URLSearchParams to object , and handle arrays
    if (config.params && config.params instanceof URLSearchParams) {
      const paramsObject: Record<string, unknown> = {}
      for (const [key, value] of config.params.entries()) {
        if (key.endsWith("[]")) {
          //  for arrays
          paramsObject[key.slice(0, -2)] = value.split(",").filter(Boolean)
        } else {
          // Otherwise, just assign the value
          paramsObject[key] = value
        }
      }

      config.params = paramsObject
    }

    if (session && session.token) {
      config.headers["Authorization"] = `Bearer ${session.token}`
    }

    return config
  },
  async (error) => {
    return Promise.reject(error)
  },
)
// Add a request interceptor to include the authentication token
AmanApi.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      logout()
    }
    return Promise.reject(error)
  },
)

// Add a request interceptor to include the authentication token
AmanApiGuest.interceptors.request.use(
  async (config) => {
    console.log("🚀 ~ config:", config.baseURL, config.url, config.data)
    const locale = i18n.language
    config.headers["Accept-language"] = locale

    return config
  },
  async (error) => {
    // Do something with request error

    return Promise.reject(error)
  },
)

export default AmanApi
