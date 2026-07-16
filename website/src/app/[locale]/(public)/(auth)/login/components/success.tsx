"use client"

import { useTranslations } from "next-intl"

import SuccessAnimation from "@/components/common/success-animation"
import Button from "@/components/ui/button"
import { useParams, useSearchParams } from "next/navigation"

type Props = {}

const Success = (props: Props) => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const courseId = searchParams.get("courseId")
  const params = useParams() as { locale: string }
  const t = useTranslations("login.success")

  // handle change mobile
  // If courseId exists, redirect to the course page (backend auto-enrolls and plays it)
  // Otherwise, use callbackUrl or default to /start
  const redirectUrl = courseId ? `/course/${courseId}` : callbackUrl || `/start`

  return (
    <div className="flex w-full max-w-md flex-col gap-20">
      <div>
        <SuccessAnimation />
        <h2 className="text-center text-xl font-semibold">{t("title")}</h2>
      </div>

      <Button as={"a"} href={`/${params.locale}${redirectUrl}`}>
        {t("button")}
      </Button>
    </div>
  )
}

export default Success
