"use client"

import { Button } from "@/components/ui/heroui-button"
import { useRouter } from "@/lib/i18n/navigation"
import { CircleArrowLeft, CircleArrowRight } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

/** Tutorial HLS stream (Bunny CDN). */
export const HOW_TO_USE_VIDEO_SRC =
  "https://vz-668e58bb-394.b-cdn.net/db4050b8-ab23-42fd-ba0c-10c6ff4f70ea/playlist.m3u8"

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false })

export default function HowToUseView() {
  const t = useTranslations("how-to-use")
  const router = useRouter()

  return (
    <div className="flex min-h-lvh flex-col bg-[#211E24]">
      <header className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-[#0A090994] px-4 py-3 backdrop-blur-xl">
        <Button
          onPress={() => router.push("/start")}
          isIconOnly
          variant="ghost"
          aria-label={t("back")}
          className="text-white">
          <CircleArrowRight strokeWidth={1.2} className="size-6 ltr:hidden" />
          <CircleArrowLeft strokeWidth={1.2} className="size-6 rtl:hidden" />
        </Button>
        <h1 className="min-w-0 flex-1 text-base font-semibold text-white md:text-lg">{t("title")}</h1>
      </header>
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-0">
          <ReactPlayer src={HOW_TO_USE_VIDEO_SRC} width="100%" height="100%" controls playsInline />
        </div>
      </div>
    </div>
  )
}
