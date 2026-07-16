import { Card } from "@heroui/react"
import { Separator } from "@heroui/react"
import type { Metadata } from "next"

import Logo from "@/components/common/logo"

import BackgroundImage from "@/components/common/background-image"
import { auth } from "@/lib/auth/auth"
import { redirect } from "@/lib/i18n/navigation"
import { routing } from "@/lib/i18n/routing"
import { setRequestLocale } from "next-intl/server"
import ChooseLanguage from "./components/choose-language"
import ChooseLanguageButton from "./components/choose-language-button"
import ChooseLanguageTitle from "./components/choose-language-title"
import { Suspense } from "react"
import WorldMap from "./components/map"
import { getTranslations } from "next-intl/server"
import CommentsSection from "./components/comments-section"
import { getRates } from "./index"
import type { Rate } from "./types"

import { generatePageMetadata } from "@/utils/generate-page-metadata"

export const generateStaticParams = async () => {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params
  const base = generatePageMetadata("home", locale, "/")
  return {
    ...base,
    alternates: {
      ...base.alternates,
      types: {
        "text/plain": [
          { url: "/llms.txt", title: "llms.txt" },
          { url: "/llms-full.txt", title: "llms-full.txt" },
        ],
      },
    },
  }
}
export default async function Home(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params
  const session = await auth()
  const locale = params.locale
  setRequestLocale(locale)
  const t = await getTranslations("home")
  if (session) redirect({ href: "/start", locale: session.user.lang || "ar" })

  let rates: Rate[] = []
  try {
    const data = await getRates({ per_page: 100, page: 1 })
    rates = data.items?.data ?? []
  } catch {
    rates = []
  }

  return (
    <>
      <BackgroundImage />
      <section className="mx-auto flex max-w-337.5 flex-col items-center justify-center gap-6 py-8 md:gap-4 lg:flex-row">
        <div className="flex w-full flex-col items-center gap-10 px-4 max-md:shrink-0 lg:w-fit">
          <div className="flex justify-center">
            <Logo className="w-28 shrink-0 xl:w-32" />
          </div>
          <Card className="w-full shrink-0 bg-[#211E24] px-4 py-6 md:px-3 lg:px-8">
            <Card.Content>
              <ChooseLanguageTitle />
              <Separator className="mx-auto my-6 w-1/2" />
              <Suspense fallback={null}>
                <ChooseLanguage />
              </Suspense>
            </Card.Content>
          </Card>
          <Suspense fallback={null}>
            <ChooseLanguageButton />
          </Suspense>
        </div>
      </section>
    </>
  )
}
