"use client"

import { siteConfig } from "@/config/site"
import { Link as NextLink } from "@/lib/i18n/navigation"
import { Button } from "@/components/ui/heroui-button"
import clsx from "clsx"
import { Menu, X } from "lucide-react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import { Suspense, useEffect, useState } from "react"
import Logo from "./logo"
import UserButton from "./user-button"
import { RadixNavMenu } from "./radix-nav-menu"
import ChangeLanguage from "./change-language"

const MOBILE_NAV_ID = "site-mobile-nav"
/** Viewport below main nav (`h-14` = 3.5rem) */
const MOBILE_MENU_HEIGHT = "calc(100dvh - 3.5rem)"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const t = useTranslations("header")

  useEffect(() => {
    if (!isMenuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (!isMenuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isMenuOpen])

  return (
    <>
      <header className="bg-default-100 sticky top-0 z-50">
        <nav className="mx-auto flex h-14 max-w-7xl items-center px-4 lg:h-16">
          <div className="flex items-center justify-end lg:hidden">
            <UserButton />
          </div>

          <div className="flex basis-full items-center max-lg:grow-0! max-lg:justify-center">
            <div className="max-w-28 shrink-0 lg:max-w-36" aria-label="brand">
              <Logo variant="horizontal" className="w-full" />
            </div>
            <ul className="mx-2 hidden list-none items-center justify-start gap-5 font-medium lg:flex lg:gap-8">
              {siteConfig.navItems.map((item) => {
                if (item.links) {
                  return (
                    <li key={item.href} className="relative shrink-0">
                      <RadixNavMenu
                        label={t(item.label)}
                        links={item.links.map((link) => ({
                          href: link.href,
                          label: t(link.label),
                        }))}
                      />
                    </li>
                  )
                }
                return (
                  <li key={item.href}>
                    <NextLink
                      className="text-white duration-150 hover:text-[#f1f1f1b9] max-lg:text-sm"
                      href={item.href}>
                      {t(item.label)}
                    </NextLink>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="hidden basis-1/5 lg:flex lg:justify-end">
            <UserButton />
          </div>

          <div className="flex basis-1 items-center justify-end gap-2 max-lg:flex-row-reverse lg:hidden">
            <Button
              isIconOnly
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls={isMenuOpen ? MOBILE_NAV_ID : undefined}
              variant="ghost"
              className="text-white"
              onPress={() => setIsMenuOpen((o) => !o)}>
              {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </Button>
          </div>
        </nav>

        <motion.div
          id={MOBILE_NAV_ID}
          role={isMenuOpen ? "dialog" : undefined}
          aria-modal={isMenuOpen ? true : undefined}
          aria-hidden={!isMenuOpen}
          aria-label={isMenuOpen ? t("nav-menu-dialog") : undefined}
          inert={!isMenuOpen || undefined}
          className={clsx(
            "bg-default-100/80 supports-backdrop-filter:bg-default-100/65 fixed inset-x-0 top-14 z-40 overflow-hidden border-t border-white/10 shadow-2xl backdrop-blur-2xl lg:hidden",
            !isMenuOpen && "pointer-events-none",
          )}
          initial={false}
          animate={{ height: isMenuOpen ? MOBILE_MENU_HEIGHT : 0 }}
          transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex h-full min-h-0 flex-col">
            <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-4 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              {siteConfig.footerNavItems.map((item, index) => (
                <li key={`${item.href}-${index}`}>
                  <NextLink
                    onClick={() => setIsMenuOpen(false)}
                    className={clsx("text-foreground block py-3 text-lg font-medium")}
                    href={item.href}>
                    {t(item.label)}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </header>
      <Suspense fallback={null}>
        <ChangeLanguage />
      </Suspense>
    </>
  )
}

export default Header
