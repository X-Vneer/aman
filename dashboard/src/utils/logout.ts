import { LOCALSTORAGE_SESSION_KEY } from "@/config"

export const logout = async () => {
  localStorage.removeItem(LOCALSTORAGE_SESSION_KEY)
  window.location.href = "/auth/login"
}
