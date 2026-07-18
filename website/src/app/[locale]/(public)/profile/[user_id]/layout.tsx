import { getSession } from "@/lib/auth/session"
import { redirect } from "@/lib/i18n/navigation"
import AmanApi from "@/services/aman"
import { UserResponse } from "../types"
import { UserProvider } from "./context/user-context"

export default async function Layout(
  props: {
    children: React.ReactNode
    params: Promise<{
      user_id: string
      locale: string
    }>
  }
) {
  const params = await props.params;

  const {
    user_id,
    locale
  } = params;

  const {
    children
  } = props;

  const session = await getSession()
  // NOTE: loose != on purpose — route param is a string, user id may be numeric
  if (!session || session.user.id != user_id) redirect({ href: "/login", locale })

  const response = await AmanApi.get<UserResponse>(`/user/users/${user_id}`)
  const user = response.data.data.item
  return (
    <section className="flex items-center justify-center gap-4 py-16 md:py-20 lg:py-24">
      <UserProvider user={user}>{children}</UserProvider>
    </section>
  )
}
