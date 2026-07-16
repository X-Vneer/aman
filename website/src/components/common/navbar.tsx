"use client"

import { useTranslations } from "next-intl"

import { siteConfig } from "@/config/site"
import { Link } from "@/lib/i18n/navigation"

type Props = {}

const NavBar = (props: Props) => {
  const t = useTranslations("header")
  return (
    <div className="flex items-center">
      <ul className="flex items-center gap-5 font-medium lg:gap-8">
        {siteConfig.navItems.map((item) => {
          return (
            <li key={item.href}>
              <Link
                className="text-white duration-150 hover:text-[#f1f1f1b9] max-lg:text-sm"
                href={item.href}>
                {/*  @ts-ignore */}
                {t(item.label)}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default NavBar
