import { AppShell, Button, Group, ScrollArea, Stack, Text } from "@mantine/core"
import {
  BadgePercent,
  BlocksIcon,
  DollarSign,
  Globe,
  LogOut,
  MonitorPause,
  User,
  UserCheck,
  Users,
} from "lucide-react"
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
    label: "coupons",
    permissionKey: "Coupon" as PermissionPaths,
    link: "/dashboard/coupons",
    icon: BadgePercent,
  },
  {
    label: "financial",
    permissionKey: "Financial" as PermissionPaths,

    link: "/dashboard/financial",
    icon: () => (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M1.875 15.625C6.32134 15.6214 10.7483 16.2102 15.0392 17.3758C15.645 17.5408 16.25 17.0908 16.25 16.4625V15.625M3.125 3.75V4.375C3.125 4.54076 3.05915 4.69973 2.94194 4.81694C2.82473 4.93415 2.66576 5 2.5 5H1.875M1.875 5V4.6875C1.875 4.17 2.295 3.75 2.8125 3.75H16.875M1.875 5V12.5M16.875 3.75V4.375C16.875 4.72 17.155 5 17.5 5H18.125M16.875 3.75H17.1875C17.705 3.75 18.125 4.17 18.125 4.6875V12.8125C18.125 13.33 17.705 13.75 17.1875 13.75H16.875M1.875 12.5V12.8125C1.875 13.0611 1.97377 13.2996 2.14959 13.4754C2.3254 13.6512 2.56386 13.75 2.8125 13.75H3.125M1.875 12.5H2.5C2.66576 12.5 2.82473 12.5658 2.94194 12.6831C3.05915 12.8003 3.125 12.9592 3.125 13.125V13.75M16.875 13.75V13.125C16.875 12.9592 16.9408 12.8003 17.0581 12.6831C17.1753 12.5658 17.3342 12.5 17.5 12.5H18.125M16.875 13.75H3.125M12.5 8.75C12.5 9.41304 12.2366 10.0489 11.7678 10.5178C11.2989 10.9866 10.663 11.25 10 11.25C9.33696 11.25 8.70107 10.9866 8.23223 10.5178C7.76339 10.0489 7.5 9.41304 7.5 8.75C7.5 8.08696 7.76339 7.45107 8.23223 6.98223C8.70107 6.51339 9.33696 6.25 10 6.25C10.663 6.25 11.2989 6.51339 11.7678 6.98223C12.2366 7.45107 12.5 8.08696 12.5 8.75ZM15 8.75H15.0067V8.75667H15V8.75ZM5 8.75H5.00667V8.75667H5V8.75Z"
          stroke="#5A5A5A"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
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
