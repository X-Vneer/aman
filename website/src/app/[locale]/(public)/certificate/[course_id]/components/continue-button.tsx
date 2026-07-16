"use client"
/* eslint-disable @next/next/no-img-element */
import Button from "@/components/ui/button"
import { Link } from "@/lib/i18n/navigation"
import { useTranslations } from "next-intl"

const ContinueButton = ({ course_id }: { course_id: string }) => {
  const t = useTranslations("certificate")
  return (
    <Button href={`/certificate/${course_id}/claim`} as={Link}>
      {t("continue")}
    </Button>
  )
}

export default ContinueButton
