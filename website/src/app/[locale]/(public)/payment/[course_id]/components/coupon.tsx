"use client"

import { FieldError, InputGroup, Label, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"
import { parseAsString, useQueryState } from "nuqs"

import Button from "@/components/ui/button"
import { useState } from "react"
import { Video } from "@/types/public-videos-response"

type Props = Video

const Coupon = (props: Props) => {
  console.log(props)
  const t = useTranslations("payment.coupon")
  const [coupon, setCoupon] = useQueryState("coupon", parseAsString.withDefault(""))
  const [c, setC] = useState(coupon)

  const handleApplyCoupon = () => {
    setCoupon(c, { shallow: false })
  }

  // Check for error condition
  const isInvalidCoupon = props.coupon && Number(props.discount) == 0

  return (
    <>
      <div className="flex items-center gap-4">
        <TextField isInvalid={!!isInvalidCoupon} className="min-w-0 flex-1" name="coupon">
          <Label className="sr-only">{t("input-placeholder")}</Label>
          <InputGroup fullWidth>
            <InputGroup.Input
              value={c}
              onChange={(e) => {
                const value = e.target.value.toUpperCase().trim()
                setC(value)
                if (!value) setCoupon("", { shallow: false })
              }}
              placeholder={t("input-placeholder")}
            />
          </InputGroup>
          {isInvalidCoupon ? <FieldError>{t("errors.invalidCoupon")}</FieldError> : null}
        </TextField>

        <Button isDisabled={!c} onClick={handleApplyCoupon} size="md" fullWidth={false}>
          {t("coupon-button")}
        </Button>
      </div>
      {!isInvalidCoupon && coupon && (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <p className="text-sm font-medium text-green-600">{t("coupon-code-applied")}</p>
        </div>
      )}
    </>
  )
}

export default Coupon
