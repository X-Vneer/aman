import {
  Badge,
  Button,
  createTheme,
  Input,
  InputWrapper,
  Menu,
  PasswordInput,
  rem,
  SegmentedControl,
  Select,
  Table,
  TableTd,
  TableTh,
  TableThead,
  TextInput,
} from "@mantine/core"
import { Calendar } from "@mantine/dates"

const primary = [
  "#f6ebff",
  "#e5d5fd",
  "#c7a8f4",
  "#a878ec",
  "#8d50e5",
  "#7c36e1",
  "#9156E6",
  "#621cc8",
  "#5717b3",
  "#4a109e",
] as const
const secondary = [
  "#e2ffff",
  "#d1fafb",
  "#a7f4f4",
  "#79edee",
  "#55e7e8",
  "#3fe4e5",
  "#2ee2e3",
  "#19c9ca",
  "#00b3b4",
  "#009b9c",
] as const

const gray = [
  "#f5f5f5",
  "#e7e7e7",
  "#cdcdcd",
  "#b2b2b2",
  "#e7e7e7",
  "#8b8b8b",
  "#848484",
  "#717171",
  "#656565",
  "#575757",
] as const

export const theme = createTheme({
  black: "#1A1B1C",

  colors: {
    primary,
    secondary,
    gray,
  },

  fontFamily: "MyCustomFont, san-serf",
  fontFamilyMonospace: "Monaco, Courier, monospace",
  primaryColor: "primary",
  radius: {
    sm: "0.35rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "2rem",
  },

  components: {
    Table: Table.extend({
      defaultProps: {
        color: "primary",
        highlightOnHover: true,
        verticalSpacing: "sm",
      },
    }),
    TableThead: TableThead.extend({
      defaultProps: {
        bg: "gray.1",
      },
    }),
    TableTh: TableTh.extend({
      defaultProps: {
        fw: 600,
      },
    }),
    TableTd: TableTd.extend({
      defaultProps: {
        c: "gray",
      },
    }),
    Badge: Badge.extend({
      defaultProps: {
        size: "lg",
        radius: "xl",
        variant: "light",
        fw: 600,
      },
    }),
    Menu: Menu.extend({
      defaultProps: {
        classNames: {
          dropdown: "menu-dropdown",
          label: "menu-label",
          item: "menu-item",
        },
        shadow: "lg",
      },
    }),
    Input: Input.extend({
      defaultProps: {
        size: "md",
        classNames: {
          input: '[type="tel"]:!text-left',
        },
        styles(theme, props) {
          const isFilled = props.variant === "filled"
          if (isFilled)
            return {
              input: {
                border: `1px solid var(--mantine-color-gray-4)`,
                background: `#f6f6f6`,
              },
            }

          return {}
        },
      },
    }),
    Select: Select.extend({
      defaultProps: {
        size: "md",

        styles(theme, props) {
          const isFilled = props.variant === "filled"
          if (isFilled)
            return {
              input: {
                border: `1px solid var(--mantine-color-gray-4)`,
                background: `#f6f6f6`,
              },
            }

          return {}
        },
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        size: "md",
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        size: "md",

        styles(theme, props) {
          const isFilled = props.variant === "filled"
          if (isFilled)
            return {
              input: {
                border: `1px solid var(--mantine-color-gray-4)`,
                background: `#f6f6f6`,
              },
            }

          return {}
        },
      },
    }),
    InputWrapper: InputWrapper.extend({
      styles: {
        label: {
          fontWeight: 400,
          marginBottom: "6px",
        },
      },
    }),
    Button: Button.extend({
      defaultProps: {
        fw: 400,
        size: "md",
      },
    }),
    Calendar: Calendar.extend({
      defaultProps: {
        classNames() {
          return {
            day: `!rounded-full data-[selected='true']:!bg-secondary`,
          }
        },
      },
    }),
    SegmentedControl: SegmentedControl.extend({
      defaultProps: {
        radius: "sm",
        style(theme) {
          return {
            border: "1px solid #C1C1C1",
            background: "#E2E2E2",
            padding: 0,
          }
        },
      },
    }),
  },
  defaultRadius: "md",
  fontSizes: {
    xs: rem(11),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),
    "2xl": rem(28),
  },
  headings: {
    fontWeight: "600",
    sizes: {
      h1: {
        fontSize: rem(36),
      },
      h2: {
        fontSize: rem(30),
      },
    },
  },
})
