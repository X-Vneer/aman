import { ActionIcon, Button, Modal } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Edit } from "lucide-react"
import { useTranslation } from "react-i18next"
import UserForm from "../../components/user-form"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserSchema } from "@/validation/user"
import { User } from "../../types"

const UserModal = ({ user }: { user: User }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const { t } = useTranslation()
  const form = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      mobile: user.mobile,
      email: user.email,
    },
  })

  return (
    <>
      <Modal opened={opened} onClose={close} centered size={"md"} title={t("users.add-title")}>
        <FormProvider {...form}>
          <UserForm onEnd={close} />
        </FormProvider>
      </Modal>

      <Button onClick={open} visibleFrom="md">
        {t("users.edit-button")}
      </Button>
      <ActionIcon onClick={open} size={"md"} radius={"sm"} hiddenFrom="md">
        <Edit size={18} />
      </ActionIcon>
    </>
  )
}

export default UserModal
