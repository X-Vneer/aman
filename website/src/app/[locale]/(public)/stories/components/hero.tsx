/* eslint-disable @next/next/no-img-element */
import { logo } from "@/assets"
import { first, second, third, fourth, fifth, sixth } from "@/assets/icons"
import { getTranslations } from "next-intl/server"
import React from "react"

type Props = {}
const icons = {
  first,
  second,
  third,
  fourth,
  fifth,
  sixth,
} as const

const Hero = async (props: Props) => {
  const t = await getTranslations("stories.hero")
  return (
    <div className="relative overflow-hidden bg-[#141313]">
      <section className="container mx-auto max-w-7xl grow px-6 py-10 md:py-14 lg:py-20">
        <div className="flex w-full flex-col items-center justify-between gap-5 pt-2 pb-6 md:pt-4 md:pb-10 lg:flex-row lg:gap-10 lg:px-10 lg:pt-6 lg:pb-16 xl:px-14 2xl:px-20">
          <div className="w-full lg:min-w-[55%]">
            <h3 className="w-fit bg-gradient-to-br from-[#FFFFFF] to-[#99999929] bg-clip-text text-[52px] leading-[1.15] font-light text-transparent max-lg:mx-auto md:text-[125px] lg:text-[145px] xl:text-[155px] rtl:leading-[1.45]">
              {t("title")}
            </h3>
          </div>
          <div className="w-full space-y-6 max-lg:text-center lg:space-y-8">
            <p className="text-sm text-[#BEB7C8]">{t("description")}</p>
            <p className="text-sm text-[#BEB7C8]">{t("description2")}</p>
            <p className="text-sm text-[#BEB7C8]">{t("description3")}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Hero
