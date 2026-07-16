import { useTranslations } from "next-intl"
import React from "react"

type Props = {
  rightAnswers: number
  totalNumber: number
}

const Score = (props: Props) => {
  const t = useTranslations("course.course-header.score")
  return (
    <div id="step2" className="flex items-center gap-4 text-white">
      <div className="flex items-center gap-2">
        <span className="text-xs text-default-500 small-text">{t("right-answers")}</span>
        <span className="text-lg">{props.rightAnswers}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-default-500 small-text">{t("total")}</span>
        <span className="text-lg">{props.totalNumber}</span>
      </div>
    </div>
  )
}

export default Score
