import { useSmallScreen } from "@/hooks/use-small-screen"
import { useParams } from "@/lib/i18n/navigation"
import { handleFormError } from "@/utils/handle-form-errors"
import { showErrorMessage } from "@/utils/show-error-message"
import { AdminSchema } from "@/validation/admins-schema"
import { DevTool } from "@hookform/devtools"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Select, SimpleGrid, Stack, Text, TextInput } from "@mantine/core"
import { useQueryClient } from "@tanstack/react-query"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import ar from "react-phone-number-input/locale/ar.json"
import en from "react-phone-number-input/locale/en.json"
import PhoneInput from "react-phone-number-input/react-hook-form"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { ROLES } from "../config"
import { Admin } from "../type"
import { PutUpdateAdmin } from "../update-admin"
import { transformArrayToPermissions, transformPermissionsToArray } from "../utils"
import Permissions from "./permissions"

const PermissionsForm = ({ initialData }: { initialData: Admin }) => {
  const { t } = useTranslation()
  const searchParams = useOptimisticSearchParams()
  const selectedId = searchParams.get("selected")

  const form = useForm({
    resolver: zodResolver(AdminSchema),
    defaultValues: {
      name: initialData.name || "",
      mobile: initialData.mobile || "",
      email: initialData.email || "",
      role_name: initialData.role_name || "",
      permissions: transformArrayToPermissions(initialData.permissions || []),
    },
  })
  const {
    control,
    formState: { errors },
  } = form
  const { lang } = useParams()

  const sm = useSmallScreen()

  // query client to update admins list
  const queryClient = useQueryClient()
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await PutUpdateAdmin(selectedId!, {
        ...data,
        permissions: transformPermissionsToArray(data.permissions),
      })
      await queryClient.invalidateQueries({
        queryKey: ["admins"],
        exact: true,
      })
      close()
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error)
      handleFormError(error, form)
    }
  })

  return (
    <Stack component={"form"} onSubmit={onSubmit} w={sm ? "100%" : undefined} gap={"lg"}>
      <Text size={"lg"}>{t("permissions.view.title")}</Text>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => {
            return (
              <TextInput
                className="grow"
                label={t(`permissions.form.name-input-label`)}
                placeholder={t(`permissions.form.name-input-placeholder`)}
                error={showErrorMessage(errors, "name")}
                {...field}
              />
            )
          }}
        />

        <div>
          <Text mb={"xs"}>{t(`permissions.form.mobile-input-label`)}</Text>
          <div dir="ltr">
            <PhoneInput
              className="items-end"
              control={form.control}
              name="mobile"
              labels={lang === "ar" ? ar : en}
              international
              countryCallingCodeEditable={false}
              defaultCountry="PS"
              inputComponent={TextInput}
              radius="md"
              error={showErrorMessage(errors, "mobile")}
            />
          </div>
        </div>
        <Controller
          name="email"
          control={control}
          render={({ field }) => {
            return (
              <TextInput
                color="gray.1"
                type="email"
                className="grow"
                label={t(`permissions.form.email-input-label`)}
                placeholder={t(`permissions.form.email-input-placeholder`)}
                error={showErrorMessage(errors, "email")}
                {...field}
              />
            )
          }}
        />
        <Controller
          name="role_name"
          control={control}
          render={({ field }) => {
            return (
              <Select
                color="gray.1"
                type=""
                className="grow"
                label={t(`permissions.form.role-input-label`)}
                placeholder={t(`permissions.form.role-input-placeholder`)}
                error={showErrorMessage(errors, "role_name")}
                data={ROLES.map((e) => ({ value: e, label: t(`permissions.roles.${e}`) }))}
                {...field}
              />
            )
          }}
        />
      </SimpleGrid>
      <FormProvider {...form}>
        <Permissions />
      </FormProvider>
      {/* <DevTool control={control} placement="bottom-left" /> */}
      <div>
        <Button type="submit" loading={form.formState.isSubmitting} size="md" px={60}>
          {t("permissions.form.save-button")}
        </Button>
      </div>
      {errors.root ? (
        <Text size="sm" c="red">
          {errors.root.message}
        </Text>
      ) : null}
    </Stack>
  )
}

export default PermissionsForm
