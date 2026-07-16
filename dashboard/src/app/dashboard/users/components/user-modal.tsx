import { UserSchema } from "@/validation/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import React, { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { User } from "../types"
import UserForm from "./user-form"
import { DevTool } from "@hookform/devtools"
import { useQueryClient } from "@tanstack/react-query"

const UserModal = ({
  children,
  user,
  onEnd,
}: {
  children: React.ReactNode
  user?: User
  onEnd?: () => void
}) => {
  const [opened, { open, close }] = useDisclosure(false)
  const { t } = useTranslation()
  const form = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      mobile: user?.mobile ? "+" + user.mobile : "",
      email: user?.email || "",
    },
  })
  const queryClient = useQueryClient()
  const invalidateUsers = () =>
    queryClient.invalidateQueries({
      queryKey: ["users"],
    })
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size={"md"}
        title={user ? t("global.edit") : t("users.add-title")}>
        <FormProvider {...form}>
          <UserForm
            user={user}
            onEnd={() => {
              close()
              invalidateUsers()
              onEnd?.()
            }}
          />
        </FormProvider>
        {/* <DevTool control={form.control} /> */}
      </Modal>

      {React.Children.map(children, (child) => {
        // Ensure the child is a valid React element
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ onClick: () => void }>, { onClick: open })
        }
        return child
      })}
    </>
  )
}

export default UserModal
