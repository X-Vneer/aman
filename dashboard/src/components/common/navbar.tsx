import { AppShell, Button, Group, ScrollArea, Stack, Text } from "@mantine/core"
import { BlocksIcon, Globe, LogOut, MonitorPause, User, UserCheck, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

import { horizontalLogo } from "@/assets"
import { NavLink, usePathname } from "@/lib/i18n/navigation"
import { cn } from "@/utils/cn"
import { logout } from "@/utils/logout"
import CollapseNavItem from "./collapse-nav-item"
import usePermissions from "@/hooks/use-permissions"
import { PermissionPaths } from "@/app/dashboard/permissions/type"

const navItems = [
  {
    label: "view",
    permissionKey: "Overview" as PermissionPaths,
    icon: BlocksIcon,
    link: [
      {
        label: "home",
        link: "/dashboard",
      },
      {
        label: "reports",
        link: "/dashboard/reports",
      },
      {
        label: "form-information",
        link: "/dashboard/form-information",
      },
    ],
  },

  {
    label: "programs",
    permissionKey: "Programs" as PermissionPaths,
    link: "/dashboard/programs",
    icon: MonitorPause,
  },
  {
    label: "users",
    permissionKey: "User" as PermissionPaths,
    link: "/dashboard/users",
    icon: Users,
  },
  {
    label: "permissions",
    permissionKey: "Permissions" as const,
    link: "/dashboard/permissions",
    icon: () => {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 14.1665V17.4998"
            stroke="#5A5A5A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.6667 4.08333L11.9167 3.75"
            stroke="#5A5A5A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.6667 5.9165L11.9167 6.24984"
            stroke="#5A5A5A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.0833 2.6665L13.75 1.9165"
            stroke="#5A5A5A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.0833 7.3335L13.75 8.0835"
            stroke="#5A5A5A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.2501 1.9165L15.9167 2.6665"
            stroke="#5A5A5A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.2501 8.0835L15.9167 7.3335"
            stroke="#5A5A5A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.0833 3.75L17.3333 4.08333"
            stroke="#5A5A5A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.0833 6.24984L17.3333 5.9165"
            stroke="#5A5A5A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.3334 10.8333V12.5C18.3334 12.942 18.1578 13.366 17.8453 13.6785C17.5327 13.9911 17.1088 14.1667 16.6667 14.1667H3.33341C2.89139 14.1667 2.46746 13.9911 2.1549 13.6785C1.84234 13.366 1.66675 12.942 1.66675 12.5V4.16667C1.66675 3.72464 1.84234 3.30072 2.1549 2.98816C2.46746 2.67559 2.89139 2.5 3.33341 2.5H9.16675"
            stroke="#5A5A5A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.66675 17.5H13.3334"
            stroke="#5A5A5A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 7.5C16.3807 7.5 17.5 6.38071 17.5 5C17.5 3.61929 16.3807 2.5 15 2.5C13.6193 2.5 12.5 3.61929 12.5 5C12.5 6.38071 13.6193 7.5 15 7.5Z"
            stroke="#5A5A5A"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    },
  },

  {
    label: "manage-site",
    permissionKey: "Website_Management" as PermissionPaths,
    icon: Globe,
    link: [
      {
        label: "certificate",
        link: "/dashboard/certificates",
      },
      {
        label: "contacts",
        link: "/dashboard/contacts",
      },
      {
        label: "reviews",
        link: "/dashboard/reviews",
      },
      {
        permissionKey: "Awareness" as PermissionPaths,
        label: "awareness",
        link: "/dashboard/awareness",
      },
      {
        label: "stories",
        link: "/dashboard/stories",
      },
      {
        label: "blogs",
        link: "/dashboard/blogs",
      },
      {
        label: "news",
        link: "/dashboard/news",
      },
      {
        label: "partners",
        link: "/dashboard/partners",
      },
    ],
  },
]
const Navbar = ({ toggle }: { toggle: () => void }) => {
  const { t } = useTranslation()
  const pathname = usePathname()
  // const { height, width } = useViewportSize();

  const hasPermissionTo = usePermissions()
  return (
    <AppShell.Navbar withBorder={false} p="lg">
      <Stack gap={"xl"} justify="space-between" flex={1}>
        <Stack gap={"xl"}>
          <AppShell.Section visibleFrom="md">
            <Group justify="center">
              <img className="h-16" src={horizontalLogo} alt="logo " />
            </Group>
          </AppShell.Section>
          <ScrollArea style={{ height: "calc(100vh - 200px)" }}>
            <Stack gap={"md"} flex={1}>
              {navItems.map((item) => {
                if (item.permissionKey && !hasPermissionTo(item.permissionKey)) return null
                // if(item.label === 'permissions' && User.)
                if (Array.isArray(item.link)) {
                  return (
                    <CollapseNavItem key={item.label + item.link} toggleNav={toggle} links={item.link}>
                      <Group gap={"xs"} key={item.label} wrap="nowrap" justify="start">
                        <item.icon width={20} />
                        <Text key={item.label}>{t(`nav.items.${item.label as "home"}`)}</Text>
                      </Group>
                    </CollapseNavItem>
                  )
                }
                return (
                  <Button
                    onClick={toggle}
                    justify="start"
                    className={cn(
                      pathname === item.link && "!border-[#E2E2E2] !bg-[#F6F6F6] !text-secondary",
                    )}
                    variant={pathname === item.link ? "outline" : "subtle"}
                    color={"#5A5A5A"}
                    component={NavLink}
                    to={item.link}
                    key={item.label}>
                    <Group gap={"xs"} key={item.label} wrap="nowrap" justify="start">
                      <item.icon width={20} />
                      <Text key={item.label}>{t(`nav.items.${item.label as "home"}`)}</Text>
                    </Group>
                  </Button>
                )
              })}
            </Stack>
          </ScrollArea>
        </Stack>
        <Stack>
          <Button
            onClick={logout}
            justify="start"
            variant="subtle"
            color="#5A5A5A"
            leftSection={<LogOut size={20} />}>
            {t("global.logout-button")}
          </Button>
        </Stack>
      </Stack>
    </AppShell.Navbar>
  )
}

export default Navbar
