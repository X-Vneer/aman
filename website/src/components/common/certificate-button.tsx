"use client"

import { Result } from "@/app/[locale]/(public)/information-center/types"
import { download } from "@/assets/icons"
import { Button } from "@/components/ui/heroui-button"
import { useTranslations } from "next-intl"
import React from "react"

type Props = {
  video: Result
}

const CertificateButton = ({ video }: Props) => {
  const t = useTranslations("certificate.certificate-card")
  return (
    <Button
      fullWidth
      variant="ghost"
      size="md"
      className="justify-between gap-2"
      render={(buttonProps) => {
        return (
          <a
            {...(buttonProps as unknown as React.ComponentPropsWithoutRef<"a">)}
            href={video.certificate_url ?? "#"}
            download={video.certificate_url ? true : undefined}
          />
        )
      }}>
      {t("download-button")}
      <img className="size-10 shrink-0" src={download.src} alt="download" />
    </Button>
  )
}

export default CertificateButton
