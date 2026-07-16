import { useSmallScreen } from "@/hooks/use-small-screen"
import { cn } from "@/utils/cn"
import { Button, Popover, Radio, RadioGroup, SimpleGrid, Stack } from "@mantine/core"
import { SlidersHorizontal } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"
export const paymentMethods = ["card", "coupon"] as const

const PaymentMethodFilter = () => {
  const { t } = useTranslation()

  const [value, setValue] = useQueryState("payment_method", parseAsString.withDefault(""))
  const [state, setState] = useState<string>(value)
  const handleApplyFilters = () => {
    setValue(state)
  }
  const clear = () => {
    setState("")
    setValue("")
  }
  const sm = useSmallScreen()
  return (
    <Popover width={sm ? 200 : 270} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className={cn("!border !border-gray-300", value !== "" && "!border-secondary")}
          color="#5A5A5A"
          size={sm ? "xs" : "sm"}
          leftSection={<SlidersHorizontal size={sm ? 17 : 20} />}>
          {t("global.payment-method")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="!border-none">
        <Stack gap={"md"}>
          <RadioGroup value={state} onChange={setState} label={t("users.filters.payment-methods.title")}>
            <Stack gap={"sm"} mt="xs">
              {paymentMethods.map((method) => (
                <Radio
                  key={method}
                  radius={"sm"}
                  size="sm"
                  color="secondary"
                  value={method}
                  label={t(`filters.payment-methods.${method}`)}
                />
              ))}
            </Stack>
          </RadioGroup>
          <SimpleGrid cols={2}>
            <Button size="sm" onClick={handleApplyFilters}>
              {t("global.apply")}
            </Button>
            <Button variant="light" color="red" size="sm" onClick={clear}>
              {t("global.reset")}
            </Button>
          </SimpleGrid>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default PaymentMethodFilter
