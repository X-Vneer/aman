import { Button, Modal, Stack, Text, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { useForm } from "@mantine/form"
import { useTranslation } from "react-i18next"
import React, { useState, useEffect } from "react"
import AmanApi from "@/services/aman"
import { showNotification } from "@mantine/notifications"
import { Check } from "lucide-react"

type Props = {
  children: React.ReactNode
  userVideoId: number
  currentFirstName?: string
  currentLastName?: string
  onSuccess?: () => void
}

const UpdateCertificateUsernameModal = ({
  children,
  userVideoId,
  currentFirstName = "",
  currentLastName = "",
  onSuccess,
}: Props) => {
  const [opened, { open, close }] = useDisclosure(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const { t } = useTranslation()

  const form = useForm({
    initialValues: {
      first_name: currentFirstName,
      last_name: currentLastName,
    },
    validate: {
      first_name: (value) => (!value ? t("users.view.update_certificate_username.first_name_required") : null),
      last_name: (value) => (!value ? t("users.view.update_certificate_username.last_name_required") : null),
    },
  })

  // Reset form when modal opens/closes or values change
  useEffect(() => {
    if (opened) {
      form.setValues({
        first_name: currentFirstName,
        last_name: currentLastName,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, currentFirstName, currentLastName])

  const handleSubmit = async (values: { first_name: string; last_name: string }) => {
    try {
      setIsSubmitting(true)
      await AmanApi.put("/user-videos/update-certificate-user-name", {
        user_video_id: userVideoId,
        first_name: values.first_name,
        last_name: values.last_name,
      })

      showNotification({
        title: t("users.view.update_certificate_username.success_title"),
        message: t("users.view.update_certificate_username.success_message"),
        color: "green",
        icon: <Check size={18} />,
      })

      // Start countdown
      setCountdown(5)
      close()

      // Countdown logic
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval)
            // Reload page after countdown
            window.location.reload()
            return null
          }
          return prev - 1
        })
      }, 1000)

      onSuccess?.()
    } catch (error) {
      console.error("Error updating certificate username:", error)
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      showNotification({
        title: t("users.view.update_certificate_username.error_title"),
        message: errorMessage || t("users.view.update_certificate_username.error_message"),
        color: "red",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size="md"
        title={t("users.view.update_certificate_username.title")}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label={t("users.view.update_certificate_username.first_name_label")}
              placeholder={t("users.view.update_certificate_username.first_name_placeholder")}
              {...form.getInputProps("first_name")}
              required
            />
            <TextInput
              label={t("users.view.update_certificate_username.last_name_label")}
              placeholder={t("users.view.update_certificate_username.last_name_placeholder")}
              {...form.getInputProps("last_name")}
              required
            />
            <Button type="submit" loading={isSubmitting} fullWidth>
              {t("users.view.update_certificate_username.submit_button")}
            </Button>
          </Stack>
        </form>
      </Modal>

      {/* Countdown Modal */}
      <Modal
        opened={countdown !== null && countdown > 0}
        onClose={() => {}}
        centered
        size="md"
        closeOnClickOutside={false}
        closeOnEscape={false}
        withCloseButton={false}
        title={t("users.view.update_certificate_username.countdown_title")}>
        <Stack gap="md" align="center">
          <Text size="xl" fw={600}>
            {countdown}
          </Text>
          <Text c="dimmed" ta="center">
            {t("users.view.update_certificate_username.countdown_message")}
          </Text>
        </Stack>
      </Modal>

      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ onClick: () => void }>, { onClick: open })
        }
        return child
      })}
    </>
  )
}

export default UpdateCertificateUsernameModal

