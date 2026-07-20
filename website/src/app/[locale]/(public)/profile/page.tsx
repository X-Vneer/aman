/* eslint-disable @next/next/no-img-element */
import { profilePlaceholder } from "@/assets"
import { certificate } from "@/assets/certificates"
import { getSession } from "@/lib/auth/session"
import { redirect } from "@/lib/i18n/navigation"
import AmanApi from "@/services/aman"
import { Card } from "@heroui/react"
import { Separator } from "@heroui/react"
import { Input, Label, TextField } from "@heroui/react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import CertificateDownloadButton from "./components/certificate-download-button"
import EditProfileButton from "./components/edit-button"
import { UserResponse } from "./types"

export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params

  const { locale } = params

  const t = await getTranslations()

  const session = await getSession()
  if (!session) redirect({ href: "/login", locale })

  const response = await AmanApi.get<UserResponse>(`/user/users/${session.user.id}`)
  const user = response.data.data.item

  return (
    <section className="flex items-center justify-center gap-4 py-10 md:py-16 lg:py-24">
      <Card className="w-full max-w-4xl shrink-0 rounded-xl bg-[#0A090959] p-1">
        <div className="mb-3 space-y-5 rounded-t-lg bg-[#1D1B1B] px-7 py-5 md:px-9 md:py-7 lg:px-12 lg:py-9">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-2">
              <img className="size-14" src={profilePlaceholder.src} alt="profile" />
              <p className="text-medium">{user.first_name || "unknown"}</p>
            </div>
            <EditProfileButton id={user.id} />
          </div>
          <div className="flex flex-col gap-4 md:flex-row">
            <TextField name="mobile" className="min-w-0 flex-1">
              <Label className="text-default-500 text-xs">{t("profile.mobile")}</Label>
              <Input readOnly className="rounded-sm" value={user.mobile || ""} />
            </TextField>
            <TextField name="email" className="min-w-0 flex-1">
              <Label className="text-default-500 text-xs">{t("profile.email")}</Label>
              <Input readOnly className="rounded-sm" value={user.email || "unknown"} />
            </TextField>
          </div>
        </div>
        <div className="space-y-4 px-4 py-4 md:px-6 lg:px-11">
          <p className="text-lg font-semibold">{t("profile.certificates")}</p>
          <div className="flex w-full flex-wrap justify-start gap-5">
            {user.userVideos?.map((video) => {
              if (video.certificate_number == null || video.certificate_url == null) {
                return null
              }

              return (
                <Card
                  key={video.video_id}
                  className="w-full max-w-[unset] overflow-hidden rounded-[21px] border border-[#5A4A73] p-0! md:max-w-[320px]">
                  <Card.Content className="relative w-full overflow-hidden rtl:text-right">
                    <div className="relative mb-3 aspect-16/7 overflow-hidden rounded-2xl">
                      <Image
                        className="h-full w-full object-cover"
                        src={certificate}
                        alt="certificate"
                      />
                      <Card.Header className="relative z-10 w-full flex-col items-start! gap-3 rounded-2xl bg-[#272525E5] px-2 py-4">
                        <div className="h-16 w-full"></div>
                      </Card.Header>
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <p className="text-foreground">{video.video_title}</p>
                      </div>
                      <Separator />
                      <div className="w-full px-1 pb-1">
                        <CertificateDownloadButton
                          href={
                            video.certificate_url
                              ? video.certificate_url
                              : video.certificate_number
                                ? `${process.env.HOST_NAME}/${locale}/certificate/${video.video_id}`
                                : "#"
                          }
                          download={Boolean(video.certificate_url)}
                          label={t("certificate.certificate-card.download-button")}
                        />
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              )
            })}
          </div>
          <div></div>
        </div>
      </Card>
    </section>
  )
}
