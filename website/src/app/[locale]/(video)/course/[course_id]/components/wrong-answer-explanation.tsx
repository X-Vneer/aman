/* eslint-disable @next/next/no-img-element */
"use client"
import { wrongIcon } from "@/assets"
import Button from "@/components/ui/button"
import { Question } from "@/types/video"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useCourseStore } from "../store/course-store-provider"
import AudioPlayer from "./audio-player"
import { useVideos } from "../context/courses-context"

type Props = {
  question: Question
  answer: string
}

const WrongAnswerExplanation = (props: Props) => {
  console.log("🚀 ~ WrongAnswerExplanation ~ props:", props)
  const { next } = useCourseStore((state) => ({
    next: state.removeCurrentQuestion,
  }))
  const t = useTranslations("course.wrong-answer-modal")

  const src = props.question.wrong_answer_audio_urls[props.answer as "answer_a"]
  const [hasEnded, setHasEnded] = useState(false)
  const handleAudioEnding = () => {
    setHasEnded(true)
  }

  // const { currentVideo } = useVideos()
  // const hasPassedCourse = currentVideo.is_rated ? true : false

  // show wrong answer explanation text
  const showSubtitle = useCourseStore((state) => state.showSubtitle)
  const wrongAnswerSubtitle = props.question[props.answer.replace("answer_", "wrong_") as "wrong_a"]

  return (
    <>
      <div className="text-center">
        <img
          src={wrongIcon.src}
          className="mx-auto mb-4 w-10 rounded-full shadow-[0_10px_85px_2px_hsl(339deg_100%_50%)]"
          alt="wrong"
        />
        <h4 className="text-xl font-semibold text-red-600">{t("title")}</h4>
        <p className="text-lg text-white">{t("description")}</p>
      </div>
      <div className="flex flex-col items-center justify-center space-y-3 rounded bg-[#292929] px-8 py-4 lg:px-10">
        <p className="text-center text-white">{t("description")}</p>
        <AudioPlayer isDisabled={true} onEnd={handleAudioEnding} src={src} name={t("reason")} />
      </div>
      {showSubtitle && (
        <div className="mt-1! rounded bg-[#292929] p-3 lg:p-4">
          <p className="text-center text-sm text-[#BEB7C8]">{wrongAnswerSubtitle}</p>
        </div>
      )}
      <div className="w-full">
        <div className="mx-auto max-w-sm">
          <Button onClick={next} isDisabled={!hasEnded} size="md">
            {t("continue-button")}
          </Button>
        </div>
      </div>
    </>
  )
}

export default WrongAnswerExplanation
