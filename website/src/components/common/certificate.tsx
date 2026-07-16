/* eslint-disable @next/next/no-img-element */

import { getCertificate } from "@/app/[locale]/(public)/information-center/[code]/get-certificate"
import { horizontalLogo } from "@/assets"
import { gmail, linkedin, twitter, whatsapp } from "@/assets/icons"
import { Card } from "@heroui/react"
import { Separator } from "@heroui/react"
import { getLocale, getTranslations } from "next-intl/server"
import {
  EmailShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "./share-buttons"
import ShareButton from "./share-button"
import CertificateButton from "./certificate-button"
import CertificateGenerating from "./certificate-generating"

const Certificate = async ({ certificate_qr_code }: { certificate_qr_code: string }) => {
  const t = await getTranslations("certificate.certificate-card")
  const tt = await getTranslations("information-center.result")
  const video = await getCertificate(certificate_qr_code)

  if (!video)
    return (
      <>
        <h1 className="mt-20 text-center">{tt("not-found")}</h1>
      </>
    )

  if (video.is_certificate_generated === false && video.is_applicable_for_certificate === true) {
    return (
      <div className="text-foreground flex w-full flex-col items-center justify-center space-y-6">
        <Card className="mx-auto w-full max-w-[unset] overflow-hidden rounded-[21px] border border-[#5A4A73] md:max-w-xl">
          <Card.Content className="relative w-full overflow-hidden p-1 rtl:text-right">
            <CertificateGenerating certificateNumber={video.certificate_number} />
          </Card.Content>
        </Card>
      </div>
    )
  }
  const locale = await getLocale()
  const certificateURl = `${process.env.HOST_NAME}/${locale}/information-center/${video.certificate_number}`
  const share = await getTranslations("share")
  const grade = ((Number(video.correct_answers) / Number(video.total_questions)) * 100).toFixed(0)

  return (
    <div className="text-foreground flex w-full flex-col items-center justify-center space-y-6">
      <h1 className="text-lg font-semibold md:text-xl lg:text-2xl">{t("title")}</h1>

      <Card className="mx-auto w-full max-w-[unset] overflow-hidden rounded-[21px] border border-[#5A4A73] p-0! md:max-w-xl">
        <Card.Content className="relative w-full overflow-hidden p-1 rtl:text-right">
          <div className="relative overflow-hidden">
            <Card.Header className="relative z-10 w-full flex-col items-start! gap-3 rounded-2xl bg-[#272525E5] px-2 py-4">
              <div className="flex w-full items-center justify-between gap-4">
                <h2 className="text-foreground">{video.evaluation}</h2>
                <img src={horizontalLogo.src} alt="Aman Logo" className="w-20" />
              </div>
              <div className="flex w-full items-center justify-between gap-8">
                <div className="w-full">
                  <h2 className="text-primary text-xl font-bold lg:text-2xl">{video.user.full_name}</h2>
                  <p className="text-default-500 mb-4">
                    {" "}
                    {t("pass")} {video.video.title}{" "}
                  </p>
                </div>
                <img src={video.certificate_qr_code || undefined} alt="Aman Logo" className="w-20" />
              </div>
            </Card.Header>
          </div>
          <div className="flex w-full flex-col items-center justify-between gap-5 px-3 py-2 md:flex-row">
            <div className="flex w-full items-center justify-between gap-4">
              <ShareButton />

              <div className="flex items-center gap-2">
                <TwitterShareButton
                  url={certificateURl}
                  title={share("title", { value: grade, course: video.video.title })}>
                  <img className="size-5" src={twitter.src} alt="share to x" />
                </TwitterShareButton>
                {/* <Button size="sm" isIconOnly variant="light"> */}
                <LinkedinShareButton
                  url={certificateURl}
                  title={share("title", { value: grade, course: video.video.title })}>
                  <img className="size-5" src={linkedin.src} alt="share to linkedin" />
                </LinkedinShareButton>
                {/* </Button> */}
              </div>
            </div>
            <div className="max-md:w-full">
              <Separator className="hidden h-10 md:block" orientation="vertical" />
              <Separator className="w-full md:hidden" orientation="horizontal" />
            </div>
            <div className="w-full">
              <CertificateButton video={video} />
            </div>
          </div>
        </Card.Content>
      </Card>
      <div className="flex flex-col items-center text-sm">
        <p>{t("share-with-others")}</p>
        <div className="mt-2 flex gap-3">
          <WhatsappShareButton
            url={certificateURl}
            title={share("title", { value: grade, course: video.video.title })}>
            <img className="size-6" src={whatsapp.src} alt="share to whatsapp" />
          </WhatsappShareButton>
          <EmailShareButton
            url={certificateURl}
            subject={t("share-title", { value: grade, course: video.video.title })}>
            <img className="size-6" src={gmail.src} alt="share to gmail" />
          </EmailShareButton>
        </div>
      </div>
    </div>
  )
}

export default Certificate
