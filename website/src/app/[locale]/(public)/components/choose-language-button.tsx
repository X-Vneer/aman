"use client"

import Link from "next/link"
import { useQueryState } from "nuqs"

import Button from "@/components/ui/button"
import { LOCALES } from "@/config"
import { useParams } from "next/navigation"

type Props = {}

const ChooseLanguageButton = (props: Props) => {
  const params = useParams() as { locale: (typeof LOCALES)[number] }

  const [language] = useQueryState("language", { defaultValue: params.locale || "ar" })

  const text = {
    ar: "التالي",
    en: "Next",
    fr: "Suivant",
    id: "Berikutnya",
  }
  return (
    <Button
      as={Link}
      href={`/${language}/start`}
      size="lg"
      color="primary"
      fullWidth
      className="mx-auto max-w-72 text-black">
      {text[language as "ar"]}
    </Button>
  )
}

export default ChooseLanguageButton
