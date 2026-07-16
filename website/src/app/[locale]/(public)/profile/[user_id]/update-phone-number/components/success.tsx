"use client"

import { useTranslations } from "next-intl"

import SuccessAnimation from "@/components/common/success-animation"
import Button from "@/components/ui/button"
import { Link } from "@/lib/i18n/navigation"

type Props = {}

const Success = (props: Props) => {
  const t = useTranslations("profile.update-mobile.success")

  // handle change mobile

  return (
    <div className="flex flex-col gap-20">
      <div>
        <SuccessAnimation />
        <h2 className="text-center text-xl font-semibold">{t("title")}</h2>
      </div>

      <Button as={Link} href={"/profile"}>
        {t("button")}
      </Button>
    </div>
  )
}

export default Success
