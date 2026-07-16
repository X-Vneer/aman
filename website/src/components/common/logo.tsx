"use client"
import Image, { ImageProps } from "next/image"
import { horizontalLogo, logo } from "@/assets"

import { Link } from "@/lib/i18n/navigation"
import { useSession } from "next-auth/react"

type Props = Omit<ImageProps, "src" | "alt"> & {
  variant?: "horizontal" | "vertical"
}

const Logo = ({ variant = "vertical", ...props }: Props) => {
  const session = useSession()
  return (
    <Link href={session.status === "unauthenticated" ? "/" : "/start"}>
      <Image src={variant === "horizontal" ? horizontalLogo : logo} alt="aman logo" {...props} />
    </Link>
  )
}

export default Logo
