/* eslint-disable @next/next/no-img-element */
"use client"

import { download } from "@/assets/icons"
import { Button } from "@/components/ui/heroui-button"
import type { ComponentPropsWithoutRef } from "react"

type Props = {
  href: string
  download?: boolean
  label: string
}

export default function CertificateDownloadButton({
  href,
  download: enableDownload,
  label,
}: Props) {
  return (
    <Button
      fullWidth
      variant="ghost"
      size="md"
      className="items-center justify-center gap-2 text-lg text-primary"
      render={(buttonProps) => (
        <a
          {...(buttonProps as unknown as ComponentPropsWithoutRef<"a">)}
          href={href}
          {...(enableDownload ? { download: true } : {})}
        />
      )}>
      {label}
      <img className="mt-1 size-10 shrink-0" src={download.src} alt="download" />
    </Button>
  )
}
