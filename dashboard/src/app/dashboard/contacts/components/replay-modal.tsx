import { Button, Group, Modal, ModalBody, Stack, Textarea, TextInput } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import React, { FormEvent, useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { PostReply } from "../reply"
import { Contact } from "../types"

type Props = {
  state: [Contact | null, React.Dispatch<React.SetStateAction<Contact | null>>]
}

const ReplayModal = ({ state }: Props) => {
  const { t } = useTranslation()
  const [contact, setContact] = state
  const onClose = useCallback(() => {
    setContact(null)
  }, [setContact])

  const [reply, setReply] = useState("")
  const queryClient = useQueryClient()
  const searchParams = useOptimisticSearchParams()
  const { mutate, isPending } = useMutation({
    mutationFn: PostReply,
    onSuccess() {
      onClose()
      queryClient.invalidateQueries({
        queryKey: ["contacts", searchParams.toString()],
      })
    },
    onError(error) {
      notifications.show({
        radius: "xs",
        color: "white",
        title: axios.isAxiosError(error) ? error.response?.data.message || "" : error.message,
        message: error.message,
        classNames: {
          title: "!text-white",
          description: "!text-white",
          root: "!bg-red-500",
        },
      })
    },
  })

  if (!contact) return null
  const onSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault()
    mutate({
      id: contact.id,
      data: {
        reply,
      },
    })
  }
  return (
    <Modal
      opened={!!contact}
      onClose={onClose}
      centered
      size={"lg"}
      radius={"lg"}
      shadow="md"
      title={t(`contacts.table.type-${contact?.type}`)}>
      <ModalBody>
        <Stack>
          <Group className="!flex-nowrap max-md:!flex-wrap">
            <TextInput label={t("contacts.table.email")} value={contact.email} variant="filled" readOnly />
            <TextInput label={t("contacts.table.name")} value={contact.name} variant="filled" readOnly />
          </Group>
          <Group className="!flex-nowrap max-md:!flex-wrap">
            <TextInput label={t("contacts.table.type")} value={contact.type} variant="filled" readOnly />
            <TextInput
              label={t("contacts.table.date")}
              value={contact.created_at}
              variant="filled"
              readOnly
            />
          </Group>
          <TextInput label={t("contacts.table.title")} value={contact.subject} variant="filled" readOnly />
          <Textarea
            rows={5}
            label={t("contacts.table.message")}
            value={contact.message}
            variant="filled"
            readOnly
          />
          {contact.reply ? (
            <Textarea
              rows={5}
              label={t("contacts.table.reply")}
              value={contact.reply}
              variant="filled"
              required
              readOnly
            />
          ) : (
            <Stack component={"form"} onSubmit={onSubmit}>
              <Textarea
                rows={5}
                label={t("contacts.reply-form.reply-input-label")}
                data-autofocus
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                variant="filled"
                rightSectionWidth={"75"}
                rightSectionProps={{
                  className: "!items-end !w-14 !p-1",
                }}
                required
                rightSection={
                  <Button loading={isPending} size="sm" type="submit">
                    {t("contacts.reply-form.reply-button")}
                  </Button>
                }
              />
            </Stack>
          )}
        </Stack>
      </ModalBody>
    </Modal>
  )
}

export default ReplayModal
