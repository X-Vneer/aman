/* eslint-disable @next/next/no-img-element */
import React from "react"

type Props = {}
import { first, fourth, second, fifth, sixth, third } from "@/assets/aman-logo-splitted"
import { getTranslations } from "next-intl/server"
import { Chip } from "@heroui/react"

export const content = [
  {
    icon: first,
    key: "first",
  },
  {
    icon: second,
    key: "second",
  },
  {
    icon: third,
    key: "third",
  },
  {
    icon: fourth,
    key: "fourth",
  },
  {
    icon: fifth,
    key: "fifth",
  },
  {
    icon: sixth,
    key: "sixth",
  },
]

const SplittedLogo = async (props: Props) => {
  const t = await getTranslations("about-us.splitted-logo")
  return (
    <div className="grid grid-cols-2 gap-4 pb-10 sm:grid-cols-3 sm:pb-16 md:grid-cols-6 md:px-10 lg:px-14 lg:pb-24 xl:px-20 xl:pb-32">
      {content.map(({ key, icon }) => {
        return (
          <div key={key} className="flex flex-col items-center gap-2">
            <div className="flex aspect-square w-full items-center justify-center">
              <img src={icon.src} alt={key} />
            </div>
            <Chip className="text-default-500 border-[#2A4444]" variant="secondary" color="default">
              {/* @ts-ignore */}
              {t(key)}
            </Chip>
          </div>
        )
      })}
    </div>
  )
}

export default SplittedLogo
