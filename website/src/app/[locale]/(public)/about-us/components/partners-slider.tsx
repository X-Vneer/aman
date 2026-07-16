/* eslint-disable @next/next/no-img-element */
"use client"
import { fifthPartner, firstPartner, fourthPartner, secondPartner, thirdPartner } from "@/assets"
import { useIsRTL } from "@/hooks/use-is-rtl"
import EmblaCarousel from "@/lib/embla/carousel-wrapper"
import AutoScroll from "embla-carousel-auto-scroll"

type Props = {}

const PartnersSlider = (props: Props) => {
  const isRTL = useIsRTL()

  return (
    <div>
      <EmblaCarousel
        slides={[
          <span key={123}></span>,

          <div
            key={"1"}
            className="embla__slide ml-4 flex aspect-square h-28 shrink-0 items-center justify-center rounded-xl bg-white p-2 select-none">
            <img className="h-full" src={firstPartner.src} alt="partner" />
          </div>,
          <div
            key={2}
            className="embla__slide ml-4 flex h-28 shrink-0 items-center justify-center rounded-xl bg-white p-2 select-none">
            {/* <img className="hidden h-full md:block" src={secondPartner.src} alt="partner" /> */}
            <img className="block h-full" src={secondPartner.src} alt="partner" />
          </div>,
          <div
            key={3}
            className="embla__slide ml-4 flex aspect-square h-28 shrink-0 items-center justify-center rounded-xl bg-white p-2 select-none">
            <img className="h-full" src={thirdPartner.src} alt="partner" />
          </div>,
          <div
            key={7}
            className="embla__slide ml-4 flex aspect-square h-28 shrink-0 items-center justify-center rounded-xl bg-white p-2 select-none">
            <img className="h-full" src={fourthPartner.src} alt="partner" />
          </div>,
          <div
            key={8}
            className="embla__slide ml-4 flex h-28 shrink-0 items-center justify-center rounded-xl bg-white p-2 select-none">
            {/* <img className="hidden h-full md:block" src={secondPartner.src} alt="partner" /> */}
            <img className="block h-full" src={fifthPartner.src} alt="partner" />
          </div>,
          <div
            key={9}
            className="embla__slide ml-4 flex aspect-square h-28 shrink-0 items-center justify-center rounded-xl bg-white p-2 select-none">
            <img className="h-full" src={firstPartner.src} alt="partner" />
          </div>,
          <div
            key={10}
            className="embla__slide ml-4 flex h-28 shrink-0 items-center justify-center rounded-xl bg-white p-2 select-none">
            {/* <img className="hidden h-full md:block" src={secondPartner.src} alt="partner" /> */}
            <img className="block h-full" src={secondPartner.src} alt="partner" />
          </div>,
          <div
            key={11}
            className="embla__slide ml-4 flex aspect-square h-28 shrink-0 items-center justify-center rounded-xl bg-white p-2 select-none">
            <img className="h-full" src={fourthPartner.src} alt="partner" />
          </div>,
          <div
            key={12}
            className="embla__slide ml-4 flex h-28 shrink-0 items-center justify-center rounded-xl bg-white p-2 select-none">
            {/* <img className="hidden h-full md:block" src={secondPartner.src} alt="partner" /> */}
            <img className="block h-full" src={fifthPartner.src} alt="partner" />
          </div>,
        ]}
        options={{ direction: isRTL ? "rtl" : "ltr", loop: true, align: "start" }}
        plugins={[
          AutoScroll({ speed: 1, playOnInit: true, stopOnMouseEnter: true, stopOnInteraction: false }),
        ]}
      />
    </div>
  )
}

export default PartnersSlider
