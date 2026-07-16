/* eslint-disable @next/next/no-img-element */
"use client"
import EmblaCarousel from "@/lib/embla/carousel-wrapper"
import { useTranslations } from "next-intl"
import React from "react"
import AutoScroll from "embla-carousel-auto-scroll"
import { useIsRTL } from "@/hooks/use-is-rtl"
import { Partner } from "../types"

type Props = {
  data: Partner[]
}

const AdditionalPartners = (props: Props) => {
  const t = useTranslations("about-us.additional-partners")

  // Split partners data in half
  const midPoint = Math.ceil(props.data.length / 2)
  const firstHalf = props.data.slice(0, midPoint)
  const secondHalf = props.data.slice(midPoint)

  // Create slides for both sliders
  const createSlides = (partners: Partner[]) => {
    return partners.map((slideContent, index) => {
      return (
        <div
          key={index}
          className="embla__slide ml-4 flex h-28 shrink-0 items-center justify-center p-2 select-none">
          <img src={slideContent.logo} alt={slideContent.name} className="h-full" />
        </div>
      )
    })
  }

  const slidesRight = createSlides(firstHalf)
  const slidesLeft = createSlides(secondHalf)

  const isRTL = useIsRTL()
  return (
    <main className="container mx-auto mb-10 max-w-7xl grow px-6">
      <section className="w-full gap-5 py-14 md:flex-row md:gap-10 md:px-10 md:py-20 lg:px-14 lg:py-24 xl:px-20">
        <div className="w-full space-y-12 text-center">
          <div className="mx-auto w-full max-w-sm space-y-1">
            <h2 className="text-foreground font-medium lg:text-2xl">{t("title")}</h2>
            <p className="text-default-500 text-sm">{t("description")}</p>
          </div>
          <div className="space-y-4">
            {/* Slider going right (left to right) */}
            <EmblaCarousel
              slides={slidesRight}
              options={{ direction: isRTL ? "rtl" : "ltr", loop: true, align: "start" }}
              plugins={[
                AutoScroll({ speed: 1, playOnInit: true, stopOnMouseEnter: true, stopOnInteraction: false }),
              ]}
            />
            {/* Slider going left (right to left) */}
            <EmblaCarousel
              slides={slidesLeft}
              options={{ direction: isRTL ? "rtl" : "ltr", loop: true, align: "start" }}
              plugins={[
                AutoScroll({ speed: -1, playOnInit: true, stopOnMouseEnter: true, stopOnInteraction: false }),
              ]}
            />
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdditionalPartners
