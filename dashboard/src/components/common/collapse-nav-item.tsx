import { PermissionPaths } from "@/app/dashboard/permissions/type"
import usePermissions from "@/hooks/use-permissions"
import { NavLink, usePathname } from "@/lib/i18n/navigation"
import { cn } from "@/utils/cn"
import { Button, Collapse, Group, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { ChevronUp } from "lucide-react"
import React from "react"
import { useTranslation } from "react-i18next"

type Props = {
  children: React.ReactNode
  links: { label: string; link: string; permissionKey?: PermissionPaths }[]
  toggleNav: () => void
}

const CollapseNavItem = ({ links, children, toggleNav }: Props) => {
  const { t } = useTranslation()
  const pathname = usePathname()

  const pathnames = links.map((e) => e.link)
  const [opened, { toggle }] = useDisclosure(false)
  const hasPermissionTo = usePermissions()

  return (
    <>
      <Button
        onClick={toggle}
        justify="space-between"
        rightSection={<ChevronUp size={20} className={cn("duration-300", opened ? "" : "rotate-180")} />}
        className={cn(pathnames.includes(pathname) && "!text-secondary !border-[#E2E2E2] !bg-[#F6F6F6]")}
        variant={pathnames.includes(pathname) ? "outline" : "subtle"}
        color={"#5A5A5A"}>
        {children}
      </Button>
      <Collapse expanded={opened}>
        <Stack gap={"xs"}>
          {links.map((item) => {
            if (item.permissionKey && !hasPermissionTo(item.permissionKey)) return null

            return (
              <Button
                fullWidth
                onClick={toggleNav}
                justify="start"
                className={cn(pathname === item.link && "!text-secondary !border-[#E2E2E2] !bg-[#F6F6F6]")}
                variant={pathname === item.link ? "outline" : "subtle"}
                color={"#5A5A5A"}
                component={NavLink}
                to={item.link}
                key={item.label}>
                <Group gap={"xs"} key={item.label} wrap="nowrap" justify="start">
                  <Text fz={"sm"} key={item.label}>
                    {t(`nav.items.${item.label as "home"}`)}
                  </Text>
                </Group>
              </Button>
            )
          })}
        </Stack>
      </Collapse>
    </>
  )
}

export default CollapseNavItem
