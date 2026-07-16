"use client"
import Button from "@/components/ui/button"
import { Link, useRouter } from "@/lib/i18n/navigation"
import { useTranslations } from "next-intl"
import React, { use, useCallback, useEffect } from "react"

type Props = {
  params: Promise<{
    course_id: string
  }>
}

const Page = (props: Props) => {
  const params = use(props.params)
  const course_id = params.course_id
  const Router = useRouter()
  const handleCourseEnding = useCallback(() => {
    Router.push({
      pathname: `/certificate/${course_id}`,
    })
  }, [Router, course_id])

  useEffect(() => {
    handleCourseEnding()
  }, [handleCourseEnding])
  const t = useTranslations("certificate")
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-10">
      <h1 className="text-4xl">{t("certificate-card.grade")}</h1>
      <div>
        <Button as={Link} href={`/certificate/${course_id}`}>
          {t("continue")}
        </Button>
      </div>
    </div>
  )
}

export default Page
