import { useParams } from "@/lib/i18n/navigation"
import { handleFormError } from "@/utils/handle-form-errors"
import { showErrorMessage } from "@/utils/show-error-message"
import { AdminSchema } from "@/validation/admins-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Modal,
  PasswordInput,
  Select,
  SimpleGrid,
  Space,
  Stack,
  Text,
  TextInput,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useQueryClient } from "@tanstack/react-query"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import ar from "react-phone-number-input/locale/ar.json"
import en from "react-phone-number-input/locale/en.json"
import PhoneInput from "react-phone-number-input/react-hook-form"
import { z } from "zod"
import { ROLES } from "../config"
import { PostCreateAdmin } from "../create-admin"
import { transformPermissionsToArray } from "../utils"
import Permissions from "./permissions"

const AddAdmin = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const { t } = useTranslation()
  const form = useForm({
    resolver: zodResolver(
      AdminSchema.extend({ password: z.string({ error: "required" }).min(6, "shortPassword") }),
    ),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      password: "",
      role_name: "",
      permissions: {
        Overview: false,
        Website_Management: false,
        User: {
          Add: false,
          Edit: false,
          Delete: false,
          Export: false,
        },
      },
    },
  })

  const { lang } = useParams()
  const {
    control,
    formState: { errors },
  } = form

  // query client to update admins list
  const queryClient = useQueryClient()
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await PostCreateAdmin({ ...data, permissions: transformPermissionsToArray(data.permissions) })
      await queryClient.invalidateQueries({
        queryKey: ["admins"],
      })
      form.reset()
      close()
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error)
      handleFormError(error, form)
    }
  })

  return (
    <>
      <Modal opened={opened} onClose={close} centered size={"xl"} title={t("permissions.add-button")}>
        <Stack component={"form"} onSubmit={onSubmit}>
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => {
                return (
                  <TextInput
                    variant="filled"
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
                  variant="filled"
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
                    variant="filled"
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
              name="password"
              control={control}
              render={({ field }) => {
                return (
                  <PasswordInput
                    color="gray.1"
                    variant="filled"
                    type="password"
                    className="grow"
                    label={t(`permissions.form.password-input-label`)}
                    placeholder={t(`permissions.form.password-input-placeholder`)}
                    error={showErrorMessage(errors, "password")}
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
                    variant="filled"
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
          <Space />

          <FormProvider {...form}>
            <Permissions />
          </FormProvider>

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
      </Modal>

      <Button onClick={open}>{t("permissions.add-button")}</Button>
    </>
  )
}

export default AddAdmin
