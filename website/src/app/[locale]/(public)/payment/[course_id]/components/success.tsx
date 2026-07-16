"use client"

import { useTranslations } from "next-intl"

import SuccessAnimation from "@/components/common/success-animation"
import Button from "@/components/ui/button"

type Props = { course_id: string; locale: string; message?: string | null }

const Success = ({ course_id, locale, message }: Props) => {
  const t = useTranslations("payment.success")

  return (
    <div className="flex flex-col gap-20">
      <div>
        <SuccessAnimation />
        <h2 className="text-center text-xl font-semibold">{t("title")}</h2>
        {message != null && message !== "" ? (
          <p className="mt-3 text-center text-sm text-green-600 dark:text-green-400" role="status">
            {message}
          </p>
        ) : null}
      </div>

      <Button as={"a"} href={`/${locale}/course/${course_id}`}>
        {t("button")}
      </Button>
    </div>
  )
}

export default Success
