import { Award, GraduationCap, MessageCircleQuestion, PlayCircle, Share2 } from "lucide-react"
import { getTranslations } from "next-intl/server"
import React from "react"

type Props = {}

const Solutions = async (props: Props) => {
  const t = await getTranslations("about-us.solutions")
  const keys = [
    {
      key: "first",
      Icon: PlayCircle,
    },
    { key: "second", Icon: MessageCircleQuestion },
    { key: "third", Icon: GraduationCap },
    { key: "fourth", Icon: Award },
    { key: "fifth", Icon: Share2 },
  ] as const

  return (
    <div className="bg-[#141313]">
      <section className="container mx-auto max-w-7xl grow px-6 pt-5 md:pt-8 lg:pt-10">
        <div className="flex w-full flex-col items-center justify-between gap-5 pt-2 pb-6 md:flex-row md:gap-10 md:px-10 md:pt-4 md:pb-10 lg:px-14 lg:pt-6 lg:pb-16 xl:px-20">
          <div className="mx-auto w-full space-y-3 max-md:max-w-[270px] max-md:text-center md:w-1/2">
            <h2 className="text-foreground font-medium lg:text-2xl">{t("title")}</h2>
            <p className="text-default-500 text-sm">{t("description")}</p>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="relative rounded-lg bg-[#0A090959] px-5 py-10 backdrop-blur-2xl md:py-12 lg:py-14">
              <div className="absolute inset-y-16 w-[1px] bg-[#4B4B4B] lg:inset-y-20 ltr:left-10 rtl:right-10" />
              <ul className="relative flex flex-col gap-10">
                {keys.map(({ key, Icon }) => {
                  return (
                    <li key={key} className="flex items-center gap-5">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded bg-[#3C3C3C]">
                        <Icon className="text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground text-sm">{t(`list.${key}.title`)}</p>
                        <p className="text-default-500 text-xs">{t(`list.${key}.description`)}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Solutions
