"use client"
import { useRouter } from "@/lib/i18n/navigation"
import { Button } from "@/components/ui/heroui-button"
import { CircleArrowLeft, CircleArrowRight } from "lucide-react"
import React from "react"

type Props = {}

const BackButton = (props: Props) => {
  const Router = useRouter()
  return (
    <Button onPress={() => Router.back()} isIconOnly variant="ghost">
      <CircleArrowRight strokeWidth={1.2} className="size-5 lg:size-6 ltr:hidden" />
      <CircleArrowLeft strokeWidth={1.2} className="size-5 lg:size-6 rtl:hidden" />
    </Button>
  )
}

export default BackButton
