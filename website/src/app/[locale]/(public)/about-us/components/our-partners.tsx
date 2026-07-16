/* eslint-disable @next/next/no-img-element */
import {
  fifthPartner,
  firstPartner,
  fourthPartner,
  partnersBackground,
  secondPartner,
  thirdPartner,
} from "@/assets"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import PartnersSlider from "./partners-slider"

type Props = {}

const OurPartners = async (props: Props) => {
  const t = await getTranslations("about-us.our-partners")
  return (
    <>
      <section>
        <div className="container mx-auto max-w-7xl grow px-6">
          <div className="flex w-full flex-col items-center justify-between gap-5 pt-6 pb-14 md:gap-10 md:px-10 md:pb-20 lg:flex-row lg:px-14 lg:pb-24 xl:px-20">
            <div className="mx-auto w-full space-y-1 max-md:max-w-sm max-md:text-center lg:w-2/5">
              <h1 className="text-foreground font-medium lg:text-2xl">{t("title")}</h1>
              <p className="text-default-500 text-sm">{t("description")}</p>
            </div>
            <div className="w-full lg:w-3/5">
              <div className="relative mx-auto w-full max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl px-4 py-8 md:px-5 md:py-10 lg:px-6 lg:py-12">
                <Image
                  src={partnersBackground}
                  alt="background"
                  aria-hidden
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* <div className="relative grid grid-cols-3 items-center gap-4 max-md:hidden md:flex">
                  <div className="flex aspect-square items-center justify-center rounded-xl bg-white p-2 sm:h-28">
                    <img className="h-full" src={firstPartner.src} alt="partner" />
                  </div>
                  <div className="flex aspect-square items-center justify-center rounded-xl bg-white p-2 sm:h-28">
                    <img className="h-full" src={fourthPartner.src} alt="partner" />
                  </div>
                  <div className="flex items-center justify-center rounded-xl bg-white p-2 max-md:aspect-square sm:h-28">
                    <img className="block h-full" src={secondPartner.src} alt="partner" />
                  </div>
                  <div className="flex aspect-square items-center justify-center rounded-xl bg-white p-2 sm:h-28">
                    <img className="h-full" src={thirdPartner.src} alt="partner" />
                  </div>
                  <div className="flex aspect-square items-center justify-center rounded-xl bg-white p-2 sm:h-28">
                    <img className="h-full" src={fifthPartner.src} alt="partner" />
                  </div>
                </div> */}
                <div className="">
                  <PartnersSlider />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default OurPartners
