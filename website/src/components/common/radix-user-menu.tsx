"use client"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { buttonVariants, Label } from "@heroui/react"
import { UserCircle2 } from "lucide-react"
import clsx from "clsx"
import { useLocale, useTranslations } from "next-intl"
import { signOut } from "next-auth/react"
import { useRouter } from "@/lib/i18n/navigation"
import { parseAsBoolean, useQueryState } from "nuqs"

type Props = {}

export function RadixUserMenu({}: Props) {
  const router = useRouter()
  const [_, seChangeLang] = useQueryState("change_lang", parseAsBoolean.withDefault(false))

  const handleSignOut = () => {
    localStorage.clear()
    document.cookie.split(";").forEach((cookie) => {
      const [name] = cookie.split("=")
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
    })
    signOut()
  }
  const t = useTranslations("profile.dropdown")
  const locale = useLocale()
  return (
    <DropdownMenu.Root dir={locale === "ar" ? "rtl" : "ltr"} modal={false}>
      <DropdownMenu.Trigger
        className={clsx(
          buttonVariants({ variant: "tertiary", isIconOnly: true, size: "md" }),
          "focus-visible:ring-accent rounded-full outline-none focus-visible:ring-2",
        )}
        aria-label="user">
        <UserCircle2 className="text-primary size-6" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={
            "dropdown__popover bg-default-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-[200] min-w-52 origin-[var(--radix-dropdown-menu-content-transform-origin)] p-1 shadow-lg outline-none"
          }
          sideOffset={8}
          align="end"
          collisionPadding={8}>
          <DropdownMenu.Item
            className={
              "text-foreground relative flex cursor-default items-center gap-2 rounded-2xl px-3 py-2 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-white/10"
            }
            onSelect={() => router.push("/profile")}>
            <Label>{t("profile")}</Label>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={
              "text-foreground relative flex cursor-default items-center gap-2 rounded-2xl px-3 py-2 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-white/10"
            }
            onSelect={() => void seChangeLang(true)}>
            <Label>{t("change-lang")}</Label>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={clsx(
              "text-danger-600! relative flex cursor-default items-center gap-2 rounded-2xl px-3 py-2 text-sm outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-white/10",
              "text-danger-600! data-highlighted:bg-danger-soft",
            )}
            onSelect={handleSignOut}>
            <Label>{t("logout")}</Label>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
