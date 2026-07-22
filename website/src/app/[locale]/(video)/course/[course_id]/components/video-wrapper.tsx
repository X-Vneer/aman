"use client"
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
  // Finished-course routing is owned entirely by the server (course page.tsx redirects a finished,
  // not-yet-generated enrollment to /certificate/[id]/claim). A second client-side push here raced
  // that redirect and targeted a different URL, so it was removed.

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
