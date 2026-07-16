import { AdminSchema } from "@/validation/admins-schema"
import { Checkbox, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core"
import { ChangeEventHandler } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import IndeterminateCheckbox from "./indeterminate-checkbox"

const Permissions = () => {
  const { t } = useTranslation()
  const form = useFormContext<z.infer<typeof AdminSchema>>()
  const { control } = form
  const values = form.watch("permissions")

  //   handle all checked
  const allChecked = Object.values(values).every((element) => {
    if (typeof element === "boolean") {
      return element
    }
    if (typeof element === "object") {
      return Object.values(element).every(Boolean)
    }
  })

  const indeterminate =
    Object.values(values).some((element) => {
      if (typeof element === "boolean") {
        return element
      }
      if (typeof element === "object") {
        return Object.values(element).some(Boolean)
      }
    }) && !allChecked
  const handleChangeCheckAll: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { checked } = e.target
    if (checked) {
      form.setValue("permissions", {
        Overview: true,
        Website_Management: true,
        User: {
          Add: true,
          Edit: true,
          Delete: true,
          Export: true,
        },
        Awareness: {
          Add: true,
          Edit: true,
          Delete: true,
        },
        Programs: {
          Add: true,
          Edit: true,
          Delete: true,
        },
      })

      return
    }
    form.setValue("permissions", {
      Overview: false,
      Website_Management: false,
      User: {
        Add: false,
        Edit: false,
        Delete: false,
        Export: false,
      },
      Awareness: {
        Add: false,
        Edit: false,
        Delete: false,
      },
      Programs: {
        Add: false,
        Edit: false,
        Delete: false,
      },
    })
  }

  return (
    <>
      <Stack w={"100%"} gap={"xs"}>
        <Text>{t("permissions.form.permissions-label")}</Text>
        <Checkbox
          color="secondary"
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={handleChangeCheckAll}
          label={t("permissions.form.permissions-placeholder")}
        />
      </Stack>
      <Paper component={Stack} p="lg">
        <Text size="lg">{t("permissions.form.detailed-permissions-title")}</Text>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <IndeterminateCheckbox formKey="User" />
          <Controller
            name="permissions.Overview"
            control={control}
            render={({ field: { value, ...field } }) => {
              return (
                <Checkbox.Card
                  className="!border-gray-300 !p-2 data-checked:!border-secondary"
                  checked={!!value}
                  {...field}>
                  <Group wrap="nowrap" align="center">
                    <Checkbox.Indicator color="secondary" />
                    <div>
                      <Text>{t("permissions.form.permissions.Overview")}</Text>
                    </div>
                  </Group>
                </Checkbox.Card>
              )
            }}
          />
          <Controller
            name="permissions.Website_Management"
            control={control}
            render={({ field: { value, ...field } }) => {
              return (
                <Checkbox.Card
                  className="!border-gray-300 !p-2 data-checked:!border-secondary"
                  checked={!!value}
                  {...field}>
                  <Group wrap="nowrap" align="center">
                    <Checkbox.Indicator color="secondary" />
                    <div>
                      <Text>{t("permissions.form.permissions.Website_Management")}</Text>
                    </div>
                  </Group>
                </Checkbox.Card>
              )
            }}
          />

          <IndeterminateCheckbox formKey="Awareness" />
          <IndeterminateCheckbox formKey="Programs" />
        </SimpleGrid>
      </Paper>
    </>
  )
}

export default Permissions
