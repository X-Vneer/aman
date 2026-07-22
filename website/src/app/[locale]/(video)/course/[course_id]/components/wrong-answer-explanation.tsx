/* eslint-disable @next/next/no-img-element */
"use client"
import { wrongIcon } from "@/assets"
import Button from "@/components/ui/button"
import { Question } from "@/types/video"
import { useTranslations } from "next-intl"
import { useCourseStore } from "../store/course-store-provider"

type Props = {
  question: Question
  answer: string
}

const WrongAnswerExplanation = (props: Props) => {
  const { next } = useCourseStore((state) => ({
    next: state.removeCurrentQuestion,
  }))
  const t = useTranslations("course.wrong-answer-modal")

  // Plain-text explanation for the answer the user picked (wrong_a / wrong_b / wrong_c).
  const wrongAnswerText = props.question[props.answer.replace("answer_", "wrong_") as "wrong_a"]

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
      {wrongAnswerText ? (
        <div className="rounded bg-[#292929] px-8 py-4 lg:px-10">
          <p className="text-center text-white">{wrongAnswerText}</p>
        </div>
      ) : null}
      <div className="w-full">
        <div className="mx-auto max-w-sm">
          <Button onClick={next} size="md">
            {t("continue-button")}
          </Button>
        </div>
      </div>
    </>
  )
}

export default WrongAnswerExplanation
