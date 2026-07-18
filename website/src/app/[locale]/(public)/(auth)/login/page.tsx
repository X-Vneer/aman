import { loginBackground } from "@/assets"
import BackgroundImage from "@/components/common/background-image"
import { getSession } from "@/lib/auth/session"
import { redirect } from "@/lib/i18n/navigation"
import { Card } from "@heroui/react"
import type { Metadata } from "next"
import LoginWithoutOtp from "./components/login-without-otp"

import { generatePageMetadata } from "@/utils/generate-page-metadata"
import { JsonLd, pageBreadcrumbSchema } from "@/components/common/json-ld"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await props.params
  return generatePageMetadata("login", locale, "/login")
}

const Page = async (props: {
  searchParams: Promise<{ [key: string]: string }>
  params: Promise<{ locale: string }>
}) => {
  const params = await props.params
  const searchParams = await props.searchParams
  const session = await getSession()
  if (session) {
    // If courseId exists, redirect to the course page (backend auto-enrolls and plays it)
    // Otherwise, use callbackUrl or default to /start
    if (searchParams.courseId) {
      redirect({ href: `/course/${searchParams.courseId}`, locale: params.locale })
    } else {
      redirect({
        href: searchParams.callbackUrl ? searchParams.callbackUrl : "/start",
        locale: params.locale,
      })
    }
  }

  return (
    <>
      <JsonLd data={pageBreadcrumbSchema("login", params.locale, "/login")} />
      <BackgroundImage src={loginBackground} />
      <section className="relative flex h-full items-center justify-center gap-4 py-8 md:py-10">
        <Card className="w-full max-w-sm border-none bg-[#0A090959] backdrop-blur-md">
          <Card.Content className="p-4 md:p-6 lg:p-8 rtl:text-right">
            <LoginWithoutOtp />
          </Card.Content>
        </Card>
      </section>
    </>
  )
}

export default Page
