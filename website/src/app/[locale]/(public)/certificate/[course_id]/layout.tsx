import { getUserVideo } from "@/app/[locale]/(video)/course/[course_id]/get-user-video"
import { auth } from "@/lib/auth/auth"
import { redirect } from "@/lib/i18n/navigation"
import axios from "axios"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { notFound } from "next/navigation"
import { VideoProvider } from "./context/video-context"

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string; course_id: string }>
}) {
  const params = await props.params

  const { children } = props

  const session = await auth()
  if (!session)
    redirect({
      href: {
        pathname: "/login",
        query: {
          callbackUrl: `/certificate/${params.course_id}`,
        },
      },
      locale: params.locale,
    })

  try {
    const video = await getUserVideo(params.course_id + "/lastShow")

    if (!video.certificate_qr_code)
      redirect({
        href: {
          pathname: `/course/${params.course_id}`,
        },
        locale: params.locale,
      })
    return (
      <>
        <main className="container mx-auto max-w-7xl grow px-6 pt-5 md:pt-8 lg:pt-10">
          <VideoProvider video={video}>{children}</VideoProvider>
        </main>
      </>
    )
  } catch (error) {
    console.log("🚀 ~ error:", error)
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        redirect({
          href: {
            pathname: `/payment/${params.course_id}`,
          },
          locale: params.locale,
        })
      }

      notFound()
    }

    if (isRedirectError(error)) throw error

    return <p>Server Error</p>
  }
}
