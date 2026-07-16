import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { GetContact } from "../get-contact"
import Loader from "@/components/common/loader"
import Error from "@/components/common/error"
import { Badge, Box, Card, Divider, Group, Image, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { contactStatus } from "../components/table"
import dayjs from "dayjs"
import "dayjs/locale/ar"
import relativeTime from "dayjs/plugin/relativeTime"
import { useEffect } from "react"
import { Mail, Phone, Calendar, User, MessageSquare, FileText, ImageIcon, Reply, Video } from "lucide-react"

dayjs.extend(relativeTime)

const InfoCard = ({ 
  icon, 
  label, 
  value, 
  color = "blue" 
}: { 
  icon: React.ReactNode
  label: string
  value: string | null | undefined
  color?: string
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: "100%" }}>
      <Group gap="xs" mb="xs">
        <Box c={`${color}.6`}>
          {icon}
        </Box>
        <Text c="dimmed" size="sm" fw={500} tt="uppercase">
          {label}
        </Text>
      </Group>
      <Text size="xl" fw={600} c="gray.9">
        {value || "-"}
      </Text>
    </Card>
  )
}

const ViewContact = () => {
  const params = useParams() as { id: string }
  const { t, i18n } = useTranslation()
  
  // Set dayjs locale based on current language
  useEffect(() => {
    dayjs.locale(i18n.language === "ar" ? "ar" : "en")
  }, [i18n.language])
  
  const { data: contact, status, error } = useQuery({
    queryKey: ["contact", params.id],
    queryFn: async () => {
      return await GetContact(params.id)
    },
  })

  if (status === "pending") return <Loader />
  if (status === "error") return <Error error={error} />

  if (!contact) return null

  const statusColor = contactStatus[contact.status as keyof typeof contactStatus]?.color || "gray"
  const typeColor = contact.type === "Complaint" ? "red" : contact.type === "Inquiry" ? "blue" : "green"

  return (
    <Stack gap="xl">
      {/* Header Section */}
      <Paper radius="lg" p="xl" style={{ 
        background: `linear-gradient(135deg, var(--mantine-color-${statusColor}-0) 0%, var(--mantine-color-${statusColor}-1) 100%)`,
        border: `2px solid var(--mantine-color-${statusColor}-3)`
      }}>
        <Group justify="space-between" align="flex-start" mb="md">
          <div>
            <Title order={2} mb="xs" c="gray.9">{t("contacts.view.title")}</Title>
            <Text c="dimmed" size="sm">
              {t("contacts.table.id")}: {contact.id}
            </Text>
          </div>
          <Badge
            size="lg"
            variant="filled"
            color={statusColor}
            radius="md"
            style={{ fontSize: "14px", padding: "8px 16px" }}>
            {t(`contacts.table.status-label-${contactStatus[contact.status as keyof typeof contactStatus]?.label}`)}
          </Badge>
        </Group>
      </Paper>

      {/* Contact Information Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        <InfoCard
          icon={<User size={20} />}
          label={t("contacts.table.name")}
          value={contact.name}
          color="blue"
        />
        <InfoCard
          icon={<Mail size={20} />}
          label={t("contacts.table.email")}
          value={contact.email}
          color="cyan"
        />
        <InfoCard
          icon={<Phone size={20} />}
          label={t("contacts.view.mobile")}
          value={contact.mobile && contact.mobile.trim() !== "" ? contact.mobile : "-"}
          color="teal"
        />
        <InfoCard
          icon={<Calendar size={20} />}
          label={t("contacts.table.date")}
          value={dayjs(new Date(contact.created_at)).fromNow()}
          color="orange"
        />
      </SimpleGrid>

      {/* Type and Status Badges */}
      <Group gap="md">
        <Badge
          size="xl"
          variant="light"
          color={typeColor}
          radius="md"
          leftSection={<FileText size={16} />}
          style={{ padding: "8px 16px" }}>
          {t(`contacts.table.type-${contact.type}`)}
        </Badge>
      </Group>

      <Divider />

      {/* Subject Section */}
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Group gap="xs" mb="md">
          <FileText size={20} color="var(--mantine-color-blue-6)" />
          <Text fw={600} size="lg" c="gray.9">
            {t("contacts.table.title")}
          </Text>
        </Group>
        <Paper p="md" bg="gray.0" radius="md" style={{ borderLeft: `4px solid var(--mantine-color-blue-6)` }}>
          <Text size="md" fw={500} style={{ whiteSpace: "pre-wrap" }}>
            {contact.subject}
          </Text>
        </Paper>
      </Card>

      {/* Video Title Section */}
      {contact.video_title && (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group gap="xs" mb="md">
            <Video size={20} color="var(--mantine-color-teal-6)" />
            <Text fw={600} size="lg" c="gray.9">
              {t("contacts.table.video_title")}
            </Text>
          </Group>
          <Paper p="md" bg="gray.0" radius="md" style={{ borderLeft: `4px solid var(--mantine-color-teal-6)` }}>
            <Text size="md" style={{ whiteSpace: "pre-wrap" }}>
              {contact.video_title}
            </Text>
          </Paper>
        </Card>
      )}

      {/* Message Section */}
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Group gap="xs" mb="md">
          <MessageSquare size={20} color="var(--mantine-color-indigo-6)" />
          <Text fw={600} size="lg" c="gray.9">
            {t("contacts.table.message")}
          </Text>
        </Group>
        <Paper p="md" bg="gray.0" radius="md" style={{ borderLeft: `4px solid var(--mantine-color-indigo-6)` }}>
          <Text size="md" style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
            {contact.message}
          </Text>
        </Paper>
      </Card>

      {/* Images Section */}
      {contact.images && contact.images.length > 0 && (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group gap="xs" mb="md">
            <ImageIcon size={20} color="var(--mantine-color-purple-6)" />
            <Text fw={600} size="lg" c="gray.9">
              {t("contacts.view.images")}
            </Text>
            <Badge size="sm" variant="light" color="purple">
              {contact.images.length}
            </Badge>
          </Group>
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing="md">
            {contact.images.map((image, index) => (
              <Card
                key={index}
                shadow="sm"
                padding={0}
                radius="md"
                withBorder
                style={{ 
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)"
                  e.currentTarget.style.boxShadow = "var(--mantine-shadow-md)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)"
                  e.currentTarget.style.boxShadow = "none"
                }}
                onClick={() => window.open(image, "_blank")}>
                <Image
                  src={image}
                  alt={`Contact image ${index + 1}`}
                  height={180}
                  fit="cover"
                />
              </Card>
            ))}
          </SimpleGrid>
        </Card>
      )}

      {/* Reply Section */}
      {contact.reply && (
        <Card shadow="sm" padding="xl" radius="md" withBorder style={{
          background: `linear-gradient(135deg, var(--mantine-color-green-0) 0%, var(--mantine-color-green-1) 100%)`,
          border: `2px solid var(--mantine-color-green-3)`
        }}>
          <Group gap="xs" mb="md">
            <Reply size={20} color="var(--mantine-color-green-7)" />
            <Text fw={600} size="lg" c="gray.9">
              {t("contacts.table.reply")}
            </Text>
            <Badge size="sm" variant="filled" color="green">
              {t("contacts.table.status-label-responded")}
            </Badge>
          </Group>
          <Paper p="lg" bg="white" radius="md" style={{ borderLeft: `4px solid var(--mantine-color-green-6)` }}>
            <Text size="md" style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
              {contact.reply}
            </Text>
          </Paper>
        </Card>
      )}
    </Stack>
  )
}

export default ViewContact

