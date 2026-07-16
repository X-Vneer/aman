/* eslint-disable @next/next/no-img-element */
"use client"
import { send } from "@/assets/icons"
import { LOCALES, SITE_URL } from "@/config"
import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/heroui-button"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import React from "react"

const ShareButton = () => {
  const t = useTranslations("certificate.certificate-card")

  const shareURL = SITE_URL
  const params = useParams() as { locale: (typeof LOCALES)[number] }

  const globalShare = async () => {
    const shareData = {
      title: siteConfig.share[params.locale].title,
      text: siteConfig.share[params.locale].description,
      url: shareURL,
    }
    try {
      if (!window.navigator.share) return
      await navigator.share(shareData)
    } catch (err) {
      console.log("🚀 ~ share ~ err:", err)
    }
  }
  return (
    <Button onPress={globalShare} size="md" variant="ghost" className="gap-2">
      <img className="size-8" src={send.src} alt="share to share" />
      {t("share-button")}
    </Button>
  )
}

export default ShareButton
