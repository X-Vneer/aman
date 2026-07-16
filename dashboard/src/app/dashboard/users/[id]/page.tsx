import { RiyalIcon } from "@/components/icons"
import useColors from "@/hooks/use-colors"
import { useParams } from "@/lib/i18n/navigation"
import { ActionIcon, Badge, Button, Group, Paper, SimpleGrid, Stack, Text, Title, Tooltip } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useSuspenseQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import "dayjs/locale/ar"
import "dayjs/locale/en"
import relativeTime from "dayjs/plugin/relativeTime"
import { Edit, Pen, RefreshCw } from "lucide-react"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import UserModal from "../components/user-modal"
import { User } from "../types"
import { GetUser } from "./get-user"
import { CertificateProgressTracker } from "./components/certificate-progress-tracker"
import UpdateCertificateUsernameModal from "./components/update-certificate-username-modal"
import { regenerateCertificate } from "./regenerate-certificate"
import { revokeCertificateIssuance } from "./revoke-certificate"

dayjs.extend(relativeTime)

/** Appends a cache-busting query param so PDF/iframes refetch after regenerate (see certRefresh in URL). */
function certificateUrlWithCacheBust(certificateUrl: string, bust: string | null) {
  if (!bust) return certificateUrl
  const joiner = certificateUrl.includes("?") ? "&" : "?"
  return `${certificateUrl}${joiner}_cb=${encodeURIComponent(bust)}`
}

const TimestampTooltip = ({ value }: { value?: string | null }) => {
  const { i18n } = useTranslation()
  if (!value) {
    return (
      <Text size="lg" fw={500}>
        —
      </Text>
    )
  }
  const d = dayjs(value)
  const locale = i18n.language === "ar" ? "ar" : "en"
  dayjs.locale(locale)
  return (
    <Tooltip label={d.format("YYYY-MM-DD HH:mm:ss")} withArrow>
      <Text size="lg" fw={500} component="span" style={{ cursor: "help" }}>
        {d.fromNow()}
      </Text>
    </Tooltip>
  )
}

const DataCell = ({ keyToRender, user }: { keyToRender: keyof User; user: User }) => {
  const { t } = useTranslation()
  return (
    <div>
      <Text c="gray.8">{t(`users.view.${keyToRender as "full_name"}`)}</Text>
      <Text size="lg" fw={500}>
        {keyToRender === "lang" ? t(`langs.${user[keyToRender]}`) : (user[keyToRender] as string)}
      </Text>
    </div>
  )
}
const ViewUser = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const { id } = useParams() as { id: string }
  const [searchParams] = useSearchParams()
  const certCacheBust = searchParams.get("certRefresh")
  const { data: user, refetch } = useSuspenseQuery({
    queryKey: ["user", id],
    queryFn: () => GetUser(id),
  })

  const { t } = useTranslation()
  const keysToRender = ["id", "full_name", "mobile", "certificate_count", "lang", "email"] as const

  const [certificate_url, setCertificate_url] = useState<string | null>(null)
  const [regeneratingCert, setRegeneratingCert] = useState<string | null>(null)
  const [revokingVideoId, setRevokingVideoId] = useState<string | number | null>(null)
  const { data: colors } = useColors()
  const handleShowCertificate = (value: string) => {
    setCertificate_url((pre) => (pre === value ? null : value))
  }

  const handleRegenerateCertificate = async (certificateNumber: string) => {
    try {
      setRegeneratingCert(certificateNumber)
      await regenerateCertificate(certificateNumber)
      showNotification({
        title: t("users.view.regenerate_certificate.success_title"),
        message: t("users.view.regenerate_certificate.success_message"),
        color: "green",
      })
      const url = new URL(window.location.href)
      url.searchParams.set("certRefresh", String(Date.now()))
      window.location.assign(url.toString())
    } catch (error) {
      console.error("regenerateCertificate", error)
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      showNotification({
        title: t("users.view.regenerate_certificate.error_title"),
        message: errorMessage || t("users.view.regenerate_certificate.error_message"),
        color: "red",
      })
    } finally {
      setRegeneratingCert(null)
    }
  }

  const handleRevokeCertificate = async (userVideoId: string | number) => {
    try {
      setRevokingVideoId(userVideoId)
      await revokeCertificateIssuance(Number(userVideoId))
      showNotification({
        title: t("user.progress.revoke_success_title"),
        message: t("user.progress.revoke_success_message"),
        color: "green",
      })
      await refetch()
    } catch (error) {
      console.error("revokeCertificateIssuance", error)
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      showNotification({
        title: t("user.progress.revoke_error_title"),
        message: errorMessage || t("user.progress.revoke_error_message"),
        color: "red",
      })
    } finally {
      setRevokingVideoId(null)
    }
  }

  return (
    <Stack>
      <Paper radius="lg" className="p-3 md:p-5">
        <Group justify="space-between" mb={"lg"}>
          <Title order={3}>{t("users.view.title")}</Title>

          <UserModal
            onEnd={() => {
              refetch()
            }}
            user={user}>
            <ActionIcon variant="subtle" size={"lg"} radius={"md"} color="gray">
              <Pen size={18} />
            </ActionIcon>
          </UserModal>
        </Group>
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {keysToRender.map((e) => {
            return <DataCell user={user} key={e} keyToRender={e} />
          })}
        </SimpleGrid>
      </Paper>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {user.userVideos.map((userVideo) => {
          return (
            <Paper component={Stack} gap="lg" className="p-3 md:p-5" key={String(userVideo.id)}>
              <Title order={3}>{userVideo.video_title}</Title>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <div>
                  <Text c="gray.8">{t(`users.view.evaluation`)}</Text>
                  <Text size="lg" fw={500}>
                    {userVideo.evaluation}
                  </Text>
                </div>
                <div>
                  <Text c="gray.8">{t(`users.view.video_played`)}</Text>
                  <Text size="lg" fw={500}>
                    {userVideo.video_played}
                  </Text>
                </div>
                <div>
                  <Text c="gray.8">{t(`users.view.correct_answers`)}</Text>
                  <Text size="lg" fw={500}>
                    {userVideo.correct_answers}/{userVideo.total_questions}
                  </Text>
                </div>
                <div>
                  <Text c="gray.8">{t(`users.view.current_time`)}</Text>
                  <Text size="lg" fw={500}>
                    {userVideo.current_time}
                  </Text>
                </div>
                <div>
                  <Text c="gray.8">{t(`users.view.certificate_number`)}</Text>
                  <Text size="lg" fw={500}>
                    {userVideo.certificate_number ?? "—"}
                  </Text>
                </div>
                <div>
                  <Text c="gray.8">{t(`users.view.coupon_code`)}</Text>
                  <Text size="lg" fw={500}>
                    {userVideo.coupon_code || "—"}
                  </Text>
                </div>
                <div>
                  <Text c="gray.8">{t(`users.view.created_at`)}</Text>
                  <TimestampTooltip value={userVideo.created_at} />
                </div>
                <div>
                  <Text c="gray.8">{t(`users.view.updated_at`)}</Text>
                  <TimestampTooltip value={userVideo.updated_at} />
                </div>
              </SimpleGrid>
              {(userVideo.certificate_url || userVideo.certificate_number) && (
                <Group gap="xs" wrap="wrap">
                  {userVideo.certificate_url && (
                    <Button
                      onClick={() => {
                        handleShowCertificate(userVideo.certificate_url!)
                      }}
                      variant="subtle"
                      color="primary">
                      {t("users.view.view_certificate")}
                    </Button>
                  )}
                  {userVideo.certificate_number && (
                    <Button
                      variant="subtle"
                      color="orange"
                      leftSection={<RefreshCw size={16} />}
                      loading={regeneratingCert === userVideo.certificate_number}
                      onClick={() => handleRegenerateCertificate(userVideo.certificate_number!)}>
                      {t("users.view.regenerate_certificate.button")}
                    </Button>
                  )}
                  {userVideo.certificate_url && (
                    <UpdateCertificateUsernameModal
                      userVideoId={Number(userVideo.id)}
                      currentFirstName={user.first_name || ""}
                      currentLastName={user.last_name || ""}
                      onSuccess={() => {
                        refetch()
                      }}>
                      <Button variant="subtle" color="gray" leftSection={<Edit size={16} />}>
                        {t("users.view.update_certificate_username.button")}
                      </Button>
                    </UpdateCertificateUsernameModal>
                  )}
                </Group>
              )}
              {userVideo.progress_phases && (
                <CertificateProgressTracker
                  phases={userVideo.progress_phases}
                  revoking={revokingVideoId === userVideo.id}
                  onRevoke={() => handleRevokeCertificate(userVideo.id)}
                />
              )}
            </Paper>
          )
        })}
      </SimpleGrid>

      {/* statistics */}
      {certificate_url ? (
        <>
          <div>
            <Button
              variant="light"
              color="primary"
              component="a"
              href={certificateUrlWithCacheBust(certificate_url, certCacheBust)}
              download>
              {t("users.view.download-certificate")}
            </Button>
          </div>
          <iframe
            src={`${certificateUrlWithCacheBust(certificate_url, certCacheBust)}#toolbar=0&navpanes=0`}
            style={{ width: "100%", height: "800px", border: "none" }}
            title="certificate"
          />
        </>
      ) : (
        <Paper component={Stack} radius={"lg"} className="p-3 md:p-5">
          <Title order={3}>{t("users.view.statistics")}</Title>
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <div>
              <Text c="gray.8">{t(`users.view.total_paid`)}</Text>
              <Text size="lg" fw={500}>
                {user.userVideos.reduce((acc, curr) => acc + Number(curr.paid), 0).toFixed()} <RiyalIcon />
              </Text>
            </div>
            <div>
              <Text c="gray.8">{t(`users.view.coupons`)}</Text>
              <Group py="sm" gap={"xs"}>
                {user.coupons?.map((coupon, index) => (
                  <Badge radius={"md"} size="xl" color="secondary" key={index}>
                    {typeof coupon === "string" ? coupon.toUpperCase() : coupon.code.toUpperCase()}
                  </Badge>
                ))}
              </Group>
            </div>
            {user.userVideos.map((video) => {
              return (
                <React.Fragment key={video.video_id}>
                  <div>
                    <Text c="gray.8">{t(`users.view.training_program`)}</Text>
                    <Text size="lg" fw={500}>
                      <Badge variant="light" size="lg" color={colors?.[video.video_id]}>
                        {video.video_title}
                      </Badge>
                    </Text>
                  </div>
                  <div>
                    <Text c="gray.8">
                      {t(`users.view.paid`, {
                        value: lang == "ar" ? video.video_title.slice(1) : video.video_title,
                      })}
                    </Text>
                    <Text size="lg" fw={500}>
                      {video.paid} <RiyalIcon />
                    </Text>
                  </div>
                </React.Fragment>
              )
            })}
          </SimpleGrid>
        </Paper>
      )}
    </Stack>
  )
}

export default ViewUser
