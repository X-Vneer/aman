import { SuccessResponse } from "@/@types"
import { User } from "@/@types/user"
import Header from "@/components/common/header"
import Navbar from "@/components/common/navbar"
import { LOCALSTORAGE_SESSION_KEY } from "@/config"
import useColors from "@/hooks/use-colors"
import { useNavigate, usePathname } from "@/lib/i18n/navigation"
import AmanApi from "@/services/aman"
import { getVideos } from "@/services/utils/get-videos"
import { isAuthenticated } from "@/utils/is-authenticated"
import { AppShell, useMatches } from "@mantine/core"
import { useDisclosure, useLocalStorage } from "@mantine/hooks"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useLayoutEffect } from "react"
import { Outlet } from "react-router"
import ProtectedRoute from "./components/protect-routes"
import MyErrorBoundary from "./error"

export function DashboardLayout() {
  const [opened, { toggle }] = useDisclosure()

  const layout = useMatches({
    md: "alt",
    sm: "default",
  }) as "alt" | "default"

  const queryClient = useQueryClient()
  // prefetch videos data
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["list", "videos"],
      queryFn: () => getVideos(),
    })
  }, [queryClient])
  const pathName = usePathname()
  const navigate = useNavigate()
  useLayoutEffect(() => {
    if (!isAuthenticated()) navigate("/auth/login")
  }, [pathName, navigate])

  const [user, updateUser] = useLocalStorage<User>({
    key: LOCALSTORAGE_SESSION_KEY,
    defaultValue: undefined,
  })

  useQuery({
    enabled: !!user,
    queryFn: async () => {
      const response = await AmanApi.get<SuccessResponse<User["item"]>>(`/admins/${user!.item.id}`)
      updateUser((pre) => {
        return {
          token: pre!.token,
          item: response.data.data.item,
        }
      })
      return ""
    },
    queryKey: ["update-admin-query"],
    staleTime: Infinity,
  })

  useColors()

  return (
    <AppShell
      className="bg-[#f6f6f6]"
      layout={layout}
      header={{ height: 58 }}
      navbar={{ width: 310, breakpoint: "md", collapsed: { mobile: !opened } }}
      padding="lg">
      <Header opened={opened} toggle={toggle} />
      <Navbar toggle={toggle} />
      <AppShell.Main>
        <ProtectedRoute />

        <MyErrorBoundary>
          <Outlet />
        </MyErrorBoundary>
      </AppShell.Main>
    </AppShell>
  )
}
