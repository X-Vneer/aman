import { useMantineTheme } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"

export const useSmallScreen = () => {
  const theme = useMantineTheme()
  const sm = useMediaQuery(`(max-width: ${theme.breakpoints.md} )`)
  return sm
}
