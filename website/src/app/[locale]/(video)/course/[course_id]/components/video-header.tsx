"use client"

import { Button } from "@/components/ui/heroui-button"
import { Separator } from "@heroui/react"
import { CircleArrowLeft, CircleArrowRight } from "lucide-react"
import Hearts from "./hearts"
import ProgressSlider from "./progress-slider"
import Score from "./socre"
import Speed from "./speed"
import { useRouter } from "@/lib/i18n/navigation"
import { useCourseStore } from "../store/course-store-provider"
import { timeToSeconds } from "../utils/time-to-seconds"
import FullScreenButton from "@/components/common/full-screen-button"

type Props = {}

const VideoHeader = (props: Props) => {
  const Router = useRouter()
  const state = useCourseStore((state) => state)

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#0A090994] backdrop-blur-2xl">
      <div className="grid landscape-header grid-cols-[100px_1fr_100px] gap-2 px-4 py-1 md:px-5 md:py-1 lg:px-6 lg:py-2">
        <div className="flex items-center">
          <Button onPress={() => Router.push("/start")} isIconOnly variant="ghost" aria-label="Go back to start">
            <CircleArrowRight strokeWidth={1.2} className="small-icon size-5 lg:size-6 ltr:hidden" />
            <CircleArrowLeft strokeWidth={1.2} className="small-icon size-5 lg:size-6 rtl:hidden" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 lg:gap-6 xl:gap-10">
          <ProgressSlider progress={Number(state.progress)} />
          <Separator orientation="vertical" />
          <Score
            rightAnswers={Number(state.correctlyAnsweredQuestions)}
            totalNumber={Number(state.totalQuestions)}
          />
          <Separator orientation="vertical" />
          <Hearts hearts={Number(state.hearts)} />
          <Separator orientation="vertical" />
          <Speed time={timeToSeconds(state.answerRate) + ""} />
        </div>
        <div className="flex items-center justify-center">
          <FullScreenButton />
        </div>
      </div>
    </header>
  )
}

export default VideoHeader
