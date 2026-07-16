"use client"

import { Link } from "@/lib/i18n/navigation"
import { buttonVariants, Label } from "@heroui/react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import clsx from "clsx"
import { ChevronDown } from "lucide-react"
import { useLocale } from "next-intl"

export type NavMenuLink = { href: string; label: string }

type Props = {
  label: string
  links: NavMenuLink[]
}

export function RadixNavMenu({ label, links }: Props) {
  const locale = useLocale()
  return (
    <DropdownMenu.Root dir={locale === "ar" ? "rtl" : "ltr"} modal={false}>
      <DropdownMenu.Trigger
        className={clsx(
          buttonVariants({ variant: "ghost" }),
          "h-auto min-w-0 gap-1 bg-transparent p-0 text-base text-white outline-none hover:bg-transparent hover:text-[#f1f1f1b9]",
        )}>
        {label}
        <ChevronDown className="size-4 shrink-0" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={
            "dropdown__popover bg-default-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-200 min-w-48 origin-[var(--radix-dropdown-menu-content-transform-origin)] p-1 shadow-lg outline-none"
          }
          sideOffset={8}
          align="center"
          collisionPadding={8}>
          {links.map((link) => (
            <DropdownMenu.Item
              key={link.href}
              className={
                "text-foreground relative flex cursor-default items-center gap-2 rounded-2xl px-3 py-2 text-sm outline-none select-none data-[highlighted]:bg-white/10"
              }
              asChild>
              <Link href={link.href}>
                <Label>{link.label}</Label>
              </Link>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
