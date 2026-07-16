"use client"
import { Link } from "@/lib/i18n/navigation"
import { Button } from "@/components/ui/heroui-button"
import { useTranslations } from "next-intl"
import type { ComponentProps } from "react"

type Props = {
  id: string
}

const EditProfileButton = ({ id }: Props) => {
  const t = useTranslations("profile")

  return (
    <Button
      variant="outline"
      className="border-2"
      render={(buttonProps) => (
        <Link
          {...(buttonProps as unknown as ComponentProps<typeof Link>)}
          href={`/profile/${id}`}
        />
      )}>
      {t("edit-button")}
    </Button>
  )
}

export default EditProfileButton
