"use client"
import React from "react"
import Button from "@/components/ui/button"
import { Link } from "@/lib/i18n/navigation"
import { PlayCircle } from "lucide-react"
import { useTranslations } from "next-intl"

type Props = {
  course: string
}

const StartCourseButton = ({ course }: Props) => {
  const t = useTranslations("information-center.result")
  return (
    <Button as={Link} href={`/course/${course}`} fullWidth={false} startContent={<PlayCircle />}>
      {t("start-course-button")}
    </Button>
  )
}

export default StartCourseButton
