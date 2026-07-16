"use client"

import { useFullscreenDocument as useFullscreen } from "@mantine/hooks"
import { Button } from "@/components/ui/heroui-button"
import { Maximize, Minimize } from "lucide-react"
import { useTranslations } from "next-intl"

type Props = {}

const FullScreenButton = (props: Props) => {
  const t = useTranslations("header")
  const { fullscreen, toggle } = useFullscreen()
  return (
    <>
      <Button
        key={"lg-screen"}
        onPress={toggle}
        className="shrink-0 items-center gap-2 rounded-sm max-md:hidden"
        variant="ghost">
        {t("full-screen")}
        {fullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
      </Button>
      <Button
        key={"small-screen"}
        onPress={toggle}
        className="items-center rounded-sm md:hidden"
        variant="ghost"
        isIconOnly
        aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
        {fullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
      </Button>
    </>
  )
}

export default FullScreenButton
