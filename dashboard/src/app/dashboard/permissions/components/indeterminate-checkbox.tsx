import { cn } from "@/utils/cn"
import { AdminSchema } from "@/validation/admins-schema"
import { ActionIcon, Box, Checkbox, CheckboxProps, Group, Popover, Stack, Text } from "@mantine/core"
import { ChevronDown } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { PERMISSIONS_OBJ } from "../config"

const IndeterminateCheckbox = ({
  formKey,
  onChange,
  ...props
}: CheckboxProps & { formKey: "User" | "Awareness" | "Programs" }) => {
  const { t } = useTranslation()
  const form = useFormContext<z.infer<typeof AdminSchema>>()
  const { control } = form

  const defaultValues = PERMISSIONS_OBJ[formKey]
  const v = Object.keys(defaultValues)

  const values = form.watch(`permissions.${formKey}`)
  //   handle all checked
  const allChecked = values ? Object.values(values).every(Boolean) : false

  const indeterminate = values ? Object.values(values).some(Boolean) && !allChecked : false

  const handleChangeCheckAll = (value: boolean) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newValues: any = {}
    v.forEach((k) => {
      newValues[k] = value
    })

    form.setValue(`permissions.${formKey}`, newValues)
  }

  const items = v.map((value) => (
    <Controller
      name={`permissions.${formKey}.${value as "Edit"}`}
      control={control}
      render={({ field: { value: checked, ...field } }) => {
        return (
          <Checkbox.Card withBorder={false} checked={!!checked} {...field}>
            <Group wrap="nowrap" align="center">
              <Checkbox.Indicator color="secondary" />
              <div>
                <Text>{t(`permissions.form.permissions.${value as "Export"}`)}</Text>
              </div>
            </Group>
          </Checkbox.Card>
        )
      }}
    />
  ))

  return (
    <Checkbox.Card
      className={cn("!border-gray-300 !p-2", (allChecked || indeterminate) && "!border-secondary")}
      onChange={handleChangeCheckAll}>
      <Group wrap="nowrap" align="center">
        <Checkbox.Indicator checked={allChecked} indeterminate={indeterminate} color="secondary" />
        <div>
          <Text>{t(`permissions.form.permissions.${formKey}`)}</Text>
        </div>
        <Box className="!flex items-center justify-center" ms="auto" onClick={(e) => e.stopPropagation()}>
          <Popover width={"250"} offset={15}>
            <Popover.Target>
              <ActionIcon variant="transparent" color="gray">
                <ChevronDown />
              </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
              <Stack py={"sm"}>{items}</Stack>
            </Popover.Dropdown>
          </Popover>
        </Box>
      </Group>
    </Checkbox.Card>
  )
}

export default IndeterminateCheckbox
