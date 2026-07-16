/* eslint-disable @next/next/no-img-element */
import { fifth, first, fourth, second, sixth, third } from "@/assets/icons"
import { getTranslations } from "next-intl/server"
import StoriesSlider from "./stories-slider"
import { StoriesResponse } from "../types"
import { AmanApiGuest } from "@/services/aman"

type Props = {}
const icons = {
  first,
  second,
  third,
  fourth,
  fifth,
  sixth,
} as const

const Stories = async (props: Props) => {
  const t = await getTranslations("stories.stories")
  const stories = await AmanApiGuest.get<StoriesResponse>("/stories", {
    params: {
      per_page: 1000,
      page: 1,
    },
  })
  const data = stories.data.data.items.data
  return (
    <div className="relative overflow-hidden">
      <section className="container mx-auto max-w-7xl grow px-6 py-10 md:py-14 lg:py-20">
        <div className="flex w-full flex-col items-center justify-between gap-8 pt-2 pb-6 md:pt-4 md:pb-10 lg:flex-row lg:gap-10 lg:px-10 lg:pt-6 lg:pb-16 xl:px-14 2xl:px-20">
          <div className="w-full lg:w-[60%]">
            <h3 className="w-fit bg-gradient-to-br from-[#FFFFFF] to-[#99999929] bg-clip-text text-[52px] leading-[1] font-light text-transparent md:text-[72px] lg:text-[85px] rtl:leading-[1.25]">
              {t.rich("title", {
                br: (chunks) => <br />,
              })}
            </h3>
            <p className="mt-4 max-w-lg text-sm text-[#BEB7C8]">{t("description")}</p>
            <p className="mt-7 max-w-lg text-sm text-[#F32261]">{t("warrning")}</p>
          </div>
          <div className="w-full lg:w-[40%]">
            <StoriesSlider stories={data} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Stories
