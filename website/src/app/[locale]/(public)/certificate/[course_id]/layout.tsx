import { getUserVideo } from "@/app/[locale]/(video)/course/[course_id]/get-user-video"
import { getSession } from "@/lib/auth/session"
import { redirect } from "@/lib/i18n/navigation"
import axios from "axios"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { redirect as nextRedirect } from "next/navigation"
import { VideoProvider } from "./context/video-context"

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string; course_id: string }>
}) {
  const params = await props.params

  const { children } = props

  const session = await getSession()
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
    // A redirect() above (e.g. "no certificate yet → course") throws — let it through.
    if (isRedirectError(error)) throw error

    if (axios.isAxiosError(error)) {
      // Expired/invalid token: clear the session cookie server-side, then land on login
      // with a return path back into this certificate page (mirrors the course page).
      if (error.response?.status === 401) {
        nextRedirect(
          `/api/auth/logout?next=${encodeURIComponent(
            `/${params.locale}/login?callbackUrl=/certificate/${params.course_id}`,
          )}`,
        )
      }
      // No enrollment / certificate for this course yet — send the user back to the course
      // to complete it instead of dead-ending on a 404.
      redirect({
        href: {
          pathname: `/course/${params.course_id}`,
        },
        locale: params.locale,
      })
    }

    return <p>Server Error</p>
  }
}
