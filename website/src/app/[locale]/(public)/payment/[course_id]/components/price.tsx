"use client"

import React from "react"
import { Card } from "@heroui/react"
import { useTranslations } from "next-intl"
import { Video } from "@/types/public-videos-response"
import { RiyalIcon } from "@/components/icons"

type Props = Video

const Price = ({ price, final_price, discount, tax_value }: Props) => {
  const t = useTranslations("payment.price")
  return (
    <Card className="bg-content2 p-0">
      <Card.Content className="flex flex-col gap-4 px-4 py-5 rtl:text-right">
        {discount && (
          <div className="flex items-center justify-between gap-4 text-green-600">
            <span>{t("discount")}</span>
            <span>
              - {discount} <RiyalIcon />
            </span>
          </div>
        )}
        <div className="flex items-center justify-between gap-4 text-green-600">
          <span>{t("vat")}</span>
          <span>
            {tax_value} <RiyalIcon />
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-xl">
          <span>{t("total")}</span>
          <span>
            {final_price || price} <RiyalIcon />
          </span>
        </div>
      </Card.Content>
    </Card>
  )
}

export default Price
