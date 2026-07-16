"use client"

import { useTranslations } from "next-intl"
import { XCircle } from "lucide-react"

import Button from "@/components/ui/button"

type Props = { course_id: string; locale: string; message?: string | null }

const Failure = ({ course_id, locale, message }: Props) => {
  const t = useTranslations("payment.failure")

  return (
    <div className="flex flex-col gap-20">
      <div>
        <div className="mx-auto flex w-52 justify-center">
          <XCircle className="text-destructive size-32" aria-hidden />
        </div>
        <h2 className="text-center text-xl font-semibold">{t("title")}</h2>
        {message != null && message !== "" ? (
          <p className="text-destructive mt-3 text-center text-sm" role="alert">
            {message}
          </p>
        ) : null}
      </div>

      <Button as={"a"} href={`/${locale}/payment/${course_id}`}>
        {t("button")}
      </Button>
    </div>
  )
}

export default Failure
