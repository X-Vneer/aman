/* eslint-disable @next/next/no-img-element */
"use client"
import ReactPlayer from "react-player"
import { useVideos } from "../context/courses-context"
import { useCourseStore } from "../store/course-store-provider"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { timeToSeconds } from "../utils/time-to-seconds"
import { Spinner } from "@heroui/react"
import { useRouter } from "@/lib/i18n/navigation"
// import { pauseButton } from "@/assets"
// import Image from "next/image"
const ColoredCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="78" height="78" viewBox="0 0 78 78" fill="none">
    <g filter="url(#filter0_b_255_821)">
      <circle cx="39" cy="39" r="39" fill="#10F92B" fillOpacity="0.18" />
    </g>
    <defs>
      <filter
        id="filter0_b_255_821"
        x="-48.75"
        y="-48.75"
        width="175.5"
        height="175.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB">
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="24.375" />
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_255_821" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_255_821" result="shape" />
      </filter>
    </defs>
  </svg>
)
interface VideoPlayerProps {}

const VideoPlayer: React.FC<VideoPlayerProps> = () => {
  const { currentVideo } = useVideos()
  const {
    questionsMap,
    lastQuestion,
    playing,
    setPlaying,
    startTime,
    setCurrentQuestion,
    volume,
    setVideoPlayerRef,
    lightPreviewDismissed,
    setLightPreviewDismissed,
  } = useCourseStore((state) => state)
  const [lastVQ, setLastVQ] = useState("0")
  // const hasPassedCourse = currentVideo.certificate_qr_code ? true : false

  const playerRef = useRef<HTMLVideoElement | null>(null)
  const seekAppliedForLoadRef = useRef(false)
  const prevVideoUrlRef = useRef<string | null>(null)

  const playerCallbackRef = useCallback(
    (node: HTMLVideoElement | null) => {
      playerRef.current = node
      setVideoPlayerRef(node)
    },
    [setVideoPlayerRef],
  )

  const onLoadedData = useCallback(() => {
    const el = playerRef.current
    if (!el || seekAppliedForLoadRef.current) return
    seekAppliedForLoadRef.current = true
    try {
      el.currentTime = timeToSeconds(startTime)
    } catch {
      /* seek can throw if media not seekable yet */
    }
  }, [startTime])

  useEffect(() => {
    const url = currentVideo.video.video_url
    if (prevVideoUrlRef.current !== null && prevVideoUrlRef.current !== url) {
      setLightPreviewDismissed(false)
      seekAppliedForLoadRef.current = false
    }
    prevVideoUrlRef.current = url
  }, [currentVideo.video.video_url, setLightPreviewDismissed])

  const [isPending, setIsPending] = useState(false)

  const Router = useRouter()
  const handleCourseEnding = () => {
    Router.push({
      pathname: `/course/${currentVideo.video_id}/redirect`,
    })
  }

  const handleVideoClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Toggle play/pause when clicking on the video area
      // Prevent triggering on modals, buttons, or other interactive elements
      const target = e.target as HTMLElement

      // Don't toggle if clicking on interactive elements
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.closest("button") ||
        target.closest("[role='dialog']") || // Modal
        target.closest("[data-slot='base']") || // NextUI Modal
        target.closest(".question-modal") // Question modal if it has this class
      ) {
        return
      }

      // Toggle if clicking on video, iframe, or player container
      if (
        target.tagName === "VIDEO" ||
        target.tagName === "IFRAME" ||
        target.classList.contains("react-player") ||
        target.closest(".react-player") ||
        target === e.currentTarget
      ) {
        setPlaying(!playing)
      }
    },
    [playing, setPlaying],
  )

  return (
    <>
      {isPending ? (
        <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <Spinner size="lg" />
        </div>
      ) : null}
      <div className="relative" onClick={handleVideoClick}>
        <ReactPlayer
          ref={playerCallbackRef}
          key={currentVideo.video.video_url}
          onLoadedData={onLoadedData}
          onWaiting={() => setIsPending(true)}
          onPlaying={() => setIsPending(false)}
          onTimeUpdate={(e) => {
            const sec = e.currentTarget.currentTime.toFixed()
            // do not show last answered question in case user refresh
            if (sec == lastQuestion || sec == lastVQ) return
            const question = questionsMap.get(sec)
            if (question) {
              setLastVQ(sec)
              setCurrentQuestion(sec)
            }
          }}
          playing={playing}
          light={
            lightPreviewDismissed
              ? false
              : (
                  <div className="h-full w-full">
                    <img
                      src={currentVideo.video.logo}
                      className="h-full w-full object-center"
                      style={{
                        width: "100%",
                        height: "100vh",
                      }}
                      alt="cover"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <ColoredCircle />
                    </div>
                  </div>
                )
          }
          onClickPreview={() => {
            setLightPreviewDismissed(true)
            setPlaying(true)
          }}
          width="100%"
          height="100vh"
          src={currentVideo.video.video_url}
          volume={volume}
          onEnded={handleCourseEnding}
          controls={false}
          playsInline
        />
      </div>
    </>
  )
}

export default VideoPlayer
