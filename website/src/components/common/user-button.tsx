"use client"
import { Button } from "@/components/ui/heroui-button"
import { useRouter } from "@/lib/i18n/navigation"
import { UserCircle2 } from "lucide-react"
import { useSession } from "@/lib/auth/session-client"
import ChangeLanguage from "./change-language"
import { RadixUserMenu } from "./radix-user-menu"

type Props = {}

export function UserDropdown() {
  return (
    <div className="flex items-center lg:gap-4">
      <RadixUserMenu />
    </div>
  )
}

const UserButton = (props: Props) => {
  const clientSession = useSession()
  const isAuthenticated = clientSession.status === "authenticated"

  const router = useRouter()

  if (isAuthenticated) return <UserDropdown />
  return (
    <Button
      isIconOnly
      aria-label="user"
      className="rounded-full"
      variant="tertiary"
      onClick={() => router.push("/login")}>
      <UserCircle2 className="size-6" />
    </Button>
  )
}

export default UserButton
