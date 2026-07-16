import type { CertificateProgressPhases } from "../../types"
import { Box, Button, Group, Stack, Text, Tooltip, useMantineTheme } from "@mantine/core"
import { CheckCircle2, Circle } from "lucide-react"
import { useTranslation } from "react-i18next"

type PhaseIndex = 1 | 2 | 3 | 4 | 5

const PHASE_KEYS: PhaseIndex[] = [1, 2, 3, 4, 5]

function phaseCompleted(phases: CertificateProgressPhases, index: PhaseIndex): boolean {
  const map: Record<PhaseIndex, keyof CertificateProgressPhases> = {
    1: "phase_1_completed",
    2: "phase_2_completed",
    3: "phase_3_completed",
    4: "phase_4_completed",
    5: "phase_5_completed",
  }
  return Boolean(phases[map[index]])
}

export function CertificateProgressTracker({
  phases,
  onRevoke,
  revoking,
}: {
  phases: CertificateProgressPhases
  onRevoke?: () => void | Promise<void>
  revoking?: boolean
}) {
  const { t } = useTranslation()
  const theme = useMantineTheme()

  return (
    <Stack gap="sm">
      <Text size="sm" fw={600} c="dimmed">
        {t("user.progress.section_title")}
      </Text>
      <Group gap="xs" wrap="nowrap" align="stretch" style={{ overflowX: "auto", paddingBottom: 4 }}>
        {PHASE_KEYS.map((phaseNum, idx) => {
          const done = phaseCompleted(phases, phaseNum)
          const isCurrent = phases.current_phase === phaseNum
          const label = t(`user.progress.phase${phaseNum}`)
          const tip = t(`user.progress.tooltip.phase${phaseNum}`)

          const accent = theme.colors.blue
          const borderColor = done ? theme.colors.green[6] : isCurrent ? accent[6] : theme.colors.gray[4]

          const bg = done ? theme.colors.green[0] : isCurrent ? accent[0] : theme.colors.gray[0]

          return (
            <Group gap={0} wrap="nowrap" key={phaseNum} style={{ flex: "1 1 0", minWidth: 72 }}>
              {idx > 0 && (
                <Box
                  style={{
                    alignSelf: "center",
                    width: 8,
                    height: 2,
                    background: theme.colors.gray[3],
                    flexShrink: 0,
                  }}
                />
              )}
              <Tooltip label={tip} multiline maw={280} withArrow position="top">
                <Box
                  style={{
                    flex: 1,
                    borderRadius: theme.radius.md,
                    borderWidth: 2,
                    borderStyle: "solid",
                    borderColor,
                    background: bg,
                    padding: theme.spacing.xs,
                    minHeight: 72,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    cursor: "default",
                  }}>
                  {done ? (
                    <CheckCircle2 size={22} color={theme.colors.green[7]} aria-hidden />
                  ) : (
                    <Circle size={22} color={theme.colors.gray[5]} aria-hidden />
                  )}
                  <Text size="xs" ta="center" lh={1.25} lineClamp={3}>
                    {label}
                  </Text>
                </Box>
              </Tooltip>
            </Group>
          )
        })}
      </Group>
      {phases.can_revoke_certificate_generation && onRevoke && (
        <Button variant="light" color="red" loading={revoking} onClick={() => void onRevoke()}>
          {t("user.progress.revoke_button")}
        </Button>
      )}
    </Stack>
  )
}
