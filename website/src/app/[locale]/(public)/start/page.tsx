import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"

import ChooseCourse from "./components/choose-course"
import { getVideos } from "@/services/utils/get-videos"
import DynamicBg from "./components/dynamic-bg"
import { HoveredCourseProvider } from "./components/hovered-course-context"
import { generatePageMetadata } from "@/utils/generate-page-metadata"

type Props = {
  params: Promise<{
    locale: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params
  return generatePageMetadata("start", locale, "/start")
}

// export const revalidate = 86400 // 1 day in seconds (24 hours)
export const revalidate = 0 // 1 day in seconds (24 hours)

const Page = async (props: Props) => {
  // Enable static rendering
  const locale = (await props.params).locale
  setRequestLocale(locale)
  const { videos, content } = await getVideos()
  const t = await getTranslations("start")

  return (
    <>
      <HoveredCourseProvider>
        <main className="container mx-auto max-w-7xl grow px-6 pt-5 md:pt-8 lg:pt-10">
          <DynamicBg />

          <section className="relative flex items-center justify-center gap-4 py-16 md:py-20">
            <div className="w-full space-y-10">
              <div className="mx-auto space-y-5 text-center">
                <h1
                  className="text-foreground [&>span]:text-primary text-4xl md:text-5xl lg:text-6xl"
                  dangerouslySetInnerHTML={{ __html: content.title }}></h1>
                <p className="text-foreground mx-auto max-w-84 text-center md:text-sm lg:max-w-160 lg:text-base">
                  {t("description")}
                </p>
              </div>
              <ChooseCourse videos={videos} />
            </div>
          </section>
        </main>
      </HoveredCourseProvider>
    </>
  )
}

export default Page
