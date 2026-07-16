"use client"
import { useRouter } from "@/lib/i18n/navigation"
import { getVideos } from "@/services/utils/get-videos"
import { Spinner } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import React from "react"
import { VideosProvider } from "../context/courses-context"
import { getUserVideo } from "../get-user-video"
import { CourseStoreProvider } from "../store/course-store-provider"
import VideoFooter from "./video-footer"
import VideoHeader from "./video-header"

type Props = {
  children: React.ReactNode
  params: {
    locale: string
    course_id: string
  }
}

const VideoWrapper = ({ children, params }: Props) => {
  const {
    data: video,
    isLoading: isLoadingUserVideo,
    isError: isUserVideoError,
    error: userVideoError,
  } = useQuery({
    queryKey: ["course", params.course_id, params.locale],
    queryFn: async () => await getUserVideo(params.course_id),
    refetchOnMount: true,
  })
  const {
    data: videos,
    isLoading: isLoadingVideos,
    isError: isVideosError,
  } = useQuery({
    queryKey: ["courses", params.locale],
    queryFn: async () => await getVideos(),
  })
  // if course has completed but skipped rating
  const Router = useRouter()
  if (video && video.certificate_qr_code && (!video.is_rated || !video.certificate_number)) {
    Router.push(`/certificate/${video.video_id}`)
    return null
  }

  if (isLoadingUserVideo || isLoadingVideos)
    return (
      <div className="flex h-svh items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  if (isVideosError || isUserVideoError)
    return (
      <div className="flex h-svh items-center justify-center">
        <p className="text-danger">Something went wrong</p>
      </div>
    )
  return (
    <VideosProvider videos={videos?.videos!} currentVideo={video!}>
      <CourseStoreProvider video={video!}>
        <VideoHeader />
        {children}
        <VideoFooter />
      </CourseStoreProvider>
    </VideosProvider>
  )
}

export default VideoWrapper
