"use client"
import EmblaCarousel from "@/lib/embla/carousel-wrapper"
import { useTranslations } from "next-intl"
import React from "react"
import AutoScroll from "embla-carousel-auto-scroll"
import { useIsRTL } from "@/hooks/use-is-rtl"

type Props = {}

const WhyUs = (props: Props) => {
  const t = useTranslations("about-us.why-us")

  const slidesContent = Array(8).fill("")
  const slides = slidesContent.map((slideContent, index) => {
    return (
      <div
        key={slideContent + index}
        className="embla__slide ml-4 flex h-24 shrink-0 items-center justify-center bg-[#1D1B1B] px-10 text-slate-50 md:ml-6 md:h-28 lg:ml-8 lg:h-32">
        {t(("reasons." + index) as "reasons.0")}
      </div>
    )
  })

  const isRTL = useIsRTL()
  return (
    <main className="container mx-auto max-w-7xl grow px-6">
      <section className="w-full gap-5 py-14 md:flex-row md:gap-10 md:px-10 md:py-20 lg:px-14 lg:py-24 xl:px-20">
        <div className="w-full space-y-12 text-center">
          <div className="mx-auto w-full max-w-sm space-y-1">
            <h2 className="text-foreground font-medium lg:text-2xl">{t("title")}</h2>
            <p className="text-default-500 text-sm">{t("description")}</p>
          </div>
          <div>
            <EmblaCarousel
              slides={slides}
              options={{ direction: isRTL ? "rtl" : "ltr", loop: true, align: "start" }}
              plugins={[
                AutoScroll({ speed: 1, playOnInit: true, stopOnMouseEnter: true, stopOnInteraction: false }),
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default WhyUs
