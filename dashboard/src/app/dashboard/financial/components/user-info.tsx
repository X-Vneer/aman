import useColors from "@/hooks/use-colors"
import { Badge, Box, Modal, SimpleGrid, Text } from "@mantine/core"
import dayjs from "dayjs"
import React from "react"
import { useTranslation } from "react-i18next"
import { type UserInfo as UserInfoType } from "../../types"
import { langs } from "../../users/components/table"

type Props = {
  userState: [UserInfoType | null, React.Dispatch<React.SetStateAction<UserInfoType | null>>]
}

const UserInfo = ({ userState }: Props) => {
  // modal state
  const [user, setUser] = userState
  const close = () => {
    setUser(null)
  }

  const { t } = useTranslation()
  const { data: colors } = useColors()

  if (!user) return null
  return (
    <Modal size="lg" onClose={close} centered opened title={t("users-info.modal-title")}>
      <SimpleGrid cols={{ base: 1, md: 2 }} mb="md">
        <div>
          <Text c="gray.8">{t(`users-info.id`)}</Text>
          <Text size="lg" fw={500}>
            {user.id}
          </Text>
        </div>
        <div>
          <Text c="gray.8">{t(`users-info.name`)}</Text>
          <Text size="lg" fw={500}>
            {user.name}
          </Text>
        </div>
        <div>
          <Text c="gray.8">{t(`users-info.certificate_count`)}</Text>
          <Text size="lg" fw={500}>
            {user.user.certificate_count}
          </Text>
        </div>
        <div>
          <Text c="gray.8">{t(`users-info.mobile`)}</Text>
          <Text size="lg" fw={500}>
            {user.user.mobile}
          </Text>
        </div>
        <div>
          <Text c="gray.8">{t(`users-info.lang`)}</Text>
          <Badge
            color={langs[user.lang].color}
            rightSection={<Box bg={langs[user.lang].color} className="size-1.5 rounded-full"></Box>}>
            {t(`langs.${user.lang}`)}
          </Badge>
        </div>
        <div>
          <Text c="gray.8">{t(`users-info.program`)}</Text>
          <Badge color={colors?.[user.video_id]}>{user.program}</Badge>
        </div>
        <div>
          <Text c="gray.8">{t(`users-info.transaction_id`)}</Text>
          <Text size="lg" fw={500}>
            {user.transaction.id}
          </Text>
        </div>
        <div>
          <Text c="gray.8">{t(`users-info.payment_method`)}</Text>
          <Text size="lg" fw={500}>
            {user.transaction.payment_method}
          </Text>
        </div>
        <div>
          <Text c="gray.8">{t(`users-info.payment_status`)}</Text>
          <Badge
            color={user.transaction.payment_status === "Accepted" ? "green" : "red"}
            rightSection={
              <Box
                bg={user.transaction.payment_status === "Accepted" ? "green" : "red"}
                className="size-1.5 rounded-full"></Box>
            }>
            { t(`home.users.table.transaction-status.${user.transaction.payment_status?.toLowerCase() as "accepted"}` ) }
          </Badge>
        </div>
        <div>
          <Text c="gray.8">{t(`users-info.transaction_date`)}</Text>
          <Text size="lg" fw={500}>
            {dayjs(new Date(user.transaction.transaction_date)).format("DD/MM/YYYY")}
          </Text>
        </div>
      </SimpleGrid>

      {user.transaction.reject_reason ? (
        <div>
          <Text c="gray.8">{t(`users-info.reject_reason`)}</Text>
          <Text size="lg" fw={500}>
            {user.transaction.reject_reason}
          </Text>
        </div>
      ) : null}
    </Modal>
  )
}

export default UserInfo
