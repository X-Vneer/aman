import AmanApi from "@/services/aman"
import Render from "./components/render"
import { UserResponse } from "@/app/[locale]/(public)/profile/types"

import { auth } from "@/lib/auth/auth"
import { redirect } from "@/lib/i18n/navigation"

const page = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params

  const { locale } = params

  const session = await auth()
  if (!session) redirect({ href: "/login", locale })
  const response = await AmanApi.get<UserResponse>(`/user/users/${session?.user.id}`)
  const user = response.data.data.item

  return <Render user={user} />
}

export default page
