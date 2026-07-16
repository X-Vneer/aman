import { getSession } from "./get-session"

export const isAuthenticated = () => {
  const session = getSession()
  return session?.token ? true : false
}
