import { timeToSeconds } from "@/app/[locale]/(video)/course/[course_id]/utils/time-to-seconds"
import Certificate from "@/components/common/certificate"

import { Card } from "@heroui/react"
import { Chip } from "@heroui/react"
import { Separator } from "@heroui/react"
import { Timer } from "lucide-react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import BackButton from "./components/back-button"
import { getCertificate } from "./get-certificate"
import StartCourseButton from "./components/start-course-button"
import { notFound } from "next/navigation"
import axios from "axios"

import { buildLocaleAlternates } from "@/utils/generate-page-metadata"
import { JsonLd, breadcrumbSchema, localizedCrumb, homeLabel } from "@/components/common/json-ld"

export const dynamic = "force-dynamic"

export async function generateMetadata(props: {
  params: Promise<{ locale: string; code: string }>
}): Promise<Metadata> {
  const { locale, code } = await props.params
  const alternates = buildLocaleAlternates(`/information-center/${code}`, locale)
  return {
    title: `${code} | مركز المعلومات — أمان`,
    alternates,
  }
}
export default async function Page(props: {
  params: Promise<{
    locale: string
    code: string
  }>
}) {
  const params = await props.params

  const { locale, code } = params

  const t = await getTranslations("information-center.result")

  const crumbs = breadcrumbSchema(
    [
      { name: homeLabel(locale), path: "" },
      { name: localizedCrumb("information-center", locale), path: "/information-center" },
      { name: code, path: `/information-center/${code}` },
    ],
    locale,
  )

  try {
    const certificate = await getCertificate(code)
    if (!certificate)
      return (
        <>
          <JsonLd data={crumbs} />
          <h1 className="mt-20 text-center">{t("not-found")}</h1>
        </>
      )
    const { video } = certificate

    return (
      <>
        <JsonLd data={crumbs} />
        <section className="flex flex-col items-center justify-center gap-8 py-8 md:gap-10 md:py-10 lg:gap-14">
          <Card className="w-full shrink-0 rounded-xl bg-[#0A090959] p-1">
            <div className="flex items-center justify-between rounded-lg bg-[#1D1B1B] p-2 md:p-3 lg:p-4">
              <h1 className="flex items-center gap-3 text-xl lg:text-2xl">
                <BackButton />

                {code}
              </h1>
              <StartCourseButton course={video.id} />
            </div>
          </Card>
          <Card className="w-full shrink-0 rounded-xl bg-[#0A090959] px-4 py-4 sm:px-8 md:px-12 md:py-6 lg:px-24 lg:py-10">
            <div className="flex flex-col items-center gap-10 md:flex-row md:gap-14 lg:gap-20">
              <div className="border-secondary w-full overflow-hidden rounded-[21px] border bg-[#0A090959] p-1 md:w-1/2">
                <div className="aspect-3/1.5 w-full overflow-hidden rounded-[18px] bg-center">
                  <img className="h-full w-full object-cover" src={video.logo} alt={video.title} />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex flex-col items-start! gap-2">
                  <h4 className="text-foreground text-xl font-semibold">{video.title}</h4>
                  <p className="text-foreground text-sm">{video.description}</p>
                  <Chip className="rounded-sm bg-[#27252570]">
                    <Timer size={18} />
                    {video.length}
                  </Chip>
                </div>
              </div>
            </div>
          </Card>
          <Card className="w-full shrink-0 rounded-xl bg-[#0A090959] px-4 py-4 sm:px-8 md:px-12 md:py-6 lg:px-24 lg:py-10">
            <Certificate certificate_qr_code={certificate.certificate_number} />
          </Card>
          <Card className="w-full shrink-0 rounded-xl bg-[#0A090959] px-4 py-4 sm:px-8 md:px-12 md:py-6 lg:px-24 lg:py-10">
            <div className="space-y-5">
              <h4 className="text-center text-2xl font-semibold">{t("grade")}</h4>

              <div className="flex shrink-0 items-stretch justify-center gap-2 md:gap-3 lg:gap-4">
                <Card className="min-w-[140px] bg-[#2E2D34] p-2 md:min-w-[210px]">
                  <Card.Header className="justify-center p-3 text-xs">{t("answers")}</Card.Header>
                  <Separator />
                  <Card.Content className="space-y-3 px-4 py-3 text-center md:px-5 lg:px-6 lg:py-4">
                    <span className="text-3xl sm:text-4xl md:text-5xl">
                      {(
                        (Number(certificate.correct_answers) / Number(certificate.total_questions)) *
                        100
                      ).toFixed(0) + "%"}
                    </span>
                    <span className="text-primary">
                      {certificate.correct_answers}/{certificate.total_questions}
                    </span>
                  </Card.Content>
                </Card>
                <Card className="min-w-[140px] shrink-0 bg-[#2E2D34] p-2 md:min-w-[210px]">
                  <Card.Header className="justify-center p-3 text-xs">{t("average-answer-time")}</Card.Header>
                  <Separator />
                  <Card.Content className="space-y-3 px-6 py-4 text-center">
                    <span className="text-3xl md:text-4xl lg:text-5xl">
                      {timeToSeconds(certificate.answer_average)}
                    </span>
                    <span className="text-primary">{t("sec")}</span>
                  </Card.Content>
                </Card>
              </div>
            </div>
          </Card>
        </section>
        <div className="h-20"></div>
      </>
    )
  } catch (error) {
    console.log("🚀 ~ error:", error)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      notFound()
    }

    return <p>Server Error</p>
  }
}
