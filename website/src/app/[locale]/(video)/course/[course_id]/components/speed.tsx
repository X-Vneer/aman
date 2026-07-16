import { Chip } from "@heroui/react"
import { Timer } from "lucide-react"
import { useTranslations } from "next-intl"
import React from "react"

type Props = {
  time: string
}

const Speed = (props: Props) => {
  const t = useTranslations("course.course-header")
  return (
    <div id="step4" className="flex items-center gap-2">
      <span className="text-default-500 small-text text-xs">{t("average-answer-time")}</span>
      <Chip variant="tertiary" size="sm" className="px-2 py-1 backdrop-blur-xl">
        <Timer size={18} className="shrink-0" />
        <Chip.Label>{props.time}</Chip.Label>
      </Chip>
    </div>
  )
}

export default Speed
