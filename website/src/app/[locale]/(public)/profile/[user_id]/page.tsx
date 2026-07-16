/* eslint-disable @next/next/no-img-element */
import { profilePlaceholder } from "@/assets"
import AmanApi from "@/services/aman"
import { Card } from "@heroui/react"
import { getTranslations } from "next-intl/server"
import { UserResponse } from "../types"
import EditProfileForm from "./components/edit-profile-form"

export default async function Page(props: { params: Promise<{ locale: string; user_id: string }> }) {
  const params = await props.params;

  const {
    user_id
  } = params;

  const t = await getTranslations("profile.edit")

  return (
    <Card className="w-full max-w-4xl shrink-0 rounded-xl bg-[#0A090959] p-1">
      <div className="space-y-1 rounded-t-lg bg-[#1D1B1B] p-3 md:p-4 lg:p-5">
        <h1 className="text-xl lg:text-2xl">{t("title")}</h1>
        <p className="text-sm text-default-500">{t("description")}</p>
        <div className="py-5"></div>
      </div>
      <div className="px-4 pb-5 md:px-6 md:pb-8 lg:px-8 lg:pb-10">
        <div className="-mt-8">
          <img className="size-16" src={profilePlaceholder.src} alt="profile" />
        </div>
        <EditProfileForm />
      </div>
    </Card>
  )
}
