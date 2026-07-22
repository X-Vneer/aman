import { getSession } from "@/lib/auth/session"
import { redirect } from "@/lib/i18n/navigation"
import { getVideos } from "@/services/utils/get-videos"
import axios from "axios"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getUserVideo } from "./get-user-video"

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { redirect as nextRedirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import VideoWrapper from "./components/video-wrapper"
import PageWrapper from "./components/page-wrapper"

import { buildLocaleAlternates } from "@/utils/generate-page-metadata"
import {
  JsonLd,
  breadcrumbSchema,
  courseSchema,
  homeLabel,
} from "@/components/common/json-ld"
import { SITE_URL } from "@/config"

type Props = {
  params: Promise<{
    locale: string
    course_id: string
  }>
}
export const dynamic = "force-dynamic"

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale, course_id } = await props.params
  const alternates = buildLocaleAlternates(`/course/${course_id}`, locale)

  try {
    const { videos } = await getVideos()
    const course = videos.find((v) => String(v.id) === String(course_id))
    if (!course) return { title: "Aman Course", alternates }

    const title = `${course.title} | أمان`
    const description = course.description?.replace(/<[^>]+>/g, "").slice(0, 180) || course.title

    return {
      title,
      description,
      alternates,
      openGraph: {
        title,
        description,
        url: alternates.canonical,
        locale,
        ...(course.logo ? { images: [{ url: course.logo }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(course.logo ? { images: [course.logo] } : {}),
      },
    }
  } catch {
    return { title: "Aman Course", alternates }
  }
}

const Layout = async (props: Props) => {
  const params = await props.params

  const session = await getSession()
  if (!session)
    return redirect({
      href: {
        pathname: "/login",
        query: {
          callbackUrl: `/course/${params.course_id}`,
          courseId: params.course_id,
        },
      },
      locale: params.locale,
    })

  try {
    const queryClient = new QueryClient() 
    
    // Fetch video data first to check redirect condition
    const video = await getUserVideo(params.course_id)
    
    // A finished course (progress >= 99, matching the backend finish threshold) whose certificate
    // isn't generated yet goes to the claim/certificate flow — not back into the video. Strict
    // === 100 previously missed rows at 99 or > 100 (re-answered questions), stranding finished
    // users on the course.
    if (Number(video.progress) >= 99 && !video.is_certificate_generated) {
      return redirect({
        href: {
          pathname: `/certificate/${params.course_id}/claim`,
        },
        locale: params.locale,
      })
    }

    // Prefetch queries using the already fetched video data
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: ["course", params.course_id, params.locale],
        queryFn: async () => video, // Use already fetched video
      }),
      queryClient.prefetchQuery({
        queryKey: ["courses", params.locale],
        queryFn: async () => await getVideos(),
      }),
    ])

    const { videos: publicVideos } = await getVideos()
    const publicCourse = publicVideos.find(
      (v) => String(v.id) === String(params.course_id),
    )
    const baseUrl = SITE_URL.replace(/\/$/, "")
    const courseUrl = `${baseUrl}/${params.locale}/course/${params.course_id}`

    const crumbs = breadcrumbSchema(
      [
        { name: homeLabel(params.locale), path: "" },
        {
          name: publicCourse?.title ?? `Course ${params.course_id}`,
          path: `/course/${params.course_id}`,
        },
      ],
      params.locale,
    )

    const course = publicCourse
      ? courseSchema({
          id: publicCourse.id,
          name: publicCourse.title,
          description:
            publicCourse.description?.replace(/<[^>]+>/g, "").trim() || publicCourse.title,
          image: publicCourse.logo,
          url: courseUrl,
          locale: params.locale,
        })
      : null

    return (
      <div className="relative flex min-h-screen flex-col">
        <JsonLd data={crumbs} />
        {course ? <JsonLd data={course} /> : null}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <VideoWrapper params={params}>
            <PageWrapper />
          </VideoWrapper>
        </HydrationBoundary>
      </div>
    )
  } catch (error) {
    // Re-throw redirect errors - they should not be caught
    if (isRedirectError(error)) {
      throw error
    }

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Expired/invalid token: clear the session cookie server-side, then land
        // on login with a return path into this course. Raw next/navigation
        // redirect on purpose — /api/* is outside the locale proxy matcher.
        nextRedirect(
          `/api/auth/logout?next=${encodeURIComponent(
            `/${params.locale}/login?callbackUrl=/course/${params.course_id}&courseId=${params.course_id}`,
          )}`,
        )
      }
      console.log("🚀 ~ Layout ~ error:", error.response?.config)
      // Backend auto-enrolls on open, so a valid video no longer 403s.
      // Treat a genuine 403/404 as a missing course.
      if (error.response?.status === 404 || error.response?.status === 403) notFound()
    }
    return <div className="text-white">Error</div>
  }
}

export default Layout
