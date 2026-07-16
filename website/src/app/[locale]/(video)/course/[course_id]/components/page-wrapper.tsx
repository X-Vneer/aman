"use client"
import dynamic from "next/dynamic"
import QuestionModal from "./question-modal"
const CustomJOYRIDE = dynamic(async () => (await import("../tour/tour")).CustomJOYRIDE, { ssr: false })
const VideoPlayer = dynamic(async () => import("./video-player"), { ssr: false })

const PageWrapper = () => {
  return (
    <div className="h-lvh w-full">
      <VideoPlayer />
      <QuestionModal />
      <CustomJOYRIDE />
    </div>
  )
}

export default PageWrapper
