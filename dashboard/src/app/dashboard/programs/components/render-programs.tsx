import Loader from "@/components/common/loader"
import usePermissions from "@/hooks/use-permissions"
import { Link } from "@/lib/i18n/navigation"
import { getVideos } from "@/services/utils/get-videos"
import { Card, Divider, Group, Image, SimpleGrid, Stack, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { CircleHelp, Clapperboard, Timer } from "lucide-react"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"
import DeleteCourseButton from "./delete-course-button"
import ProgramStatusMenu from "./program-status-menu"
import ToggleActivity from "./toggle-activity"

const RenderPrograms = () => {
  const { t } = useTranslation()

  const searchParams = useOptimisticSearchParams()

  const { data, error, status } = useQuery({
    queryKey: ["programs", searchParams.toString()],
    queryFn: async () => await getVideos(searchParams),
  })
  const hasPermissionTo = usePermissions()

  if (status === "pending") return <Loader />
  if (status === "error") return <div>error</div>

  return (
    <>
      <div className="h-5"></div>
      <SimpleGrid cols={{ base: 1, sm: 3, md: 2, lg: 3 }} spacing={20}>
        {data.map((element) => {
          return (
            <Card padding="md" radius="md">
              <Card.Section
                h={310}
                className="overflow-hidden"
                component={Link}
                to={`/dashboard/programs/${element.id}`}
                p={"xs"}>
                <Image
                  radius={"sm"}
                  src={element.logo}
                  className="h-full w-full object-cover"
                  alt={element.title}
                />
              </Card.Section>

              {/* <div className="absolute start-2 top-2">
                <VideoContextMenu {...element} />
              </div> */}

              <Stack gap={"xs"} justify="space-between" className="grow">
                <Group justify="space-between" mt="xs">
                  {hasPermissionTo("Programs:Edit") ? (
                    <Text component={Link} to={`/dashboard/programs/${element.id}`} fw={400}>
                      {element.title}
                    </Text>
                  ) : (
                    <Text fw={400}>{element.title}</Text>
                  )}
                  <Group wrap="nowrap" gap="xs">
                    {hasPermissionTo("Programs:Delete") ? <DeleteCourseButton {...element} /> : null}
                    {hasPermissionTo("Programs:Delete") ? <ToggleActivity {...element} /> : null}
                    {hasPermissionTo("Programs:Edit") ? <ProgramStatusMenu {...element} /> : null}
                  </Group>
                </Group>
                <Text component={Link} to={`/dashboard/programs/${element.id}`} size="sm" c={"#3E4142"}>
                  {element.description}
                </Text>
                <Group justify="space-between">
                  <Group>
                    <Timer size={20} strokeWidth={1.2} className="text-[#18BDBE]" />
                    <Text size="sm" c={"gray"}>
                      {element.length}
                    </Text>
                  </Group>
                  <Divider orientation="vertical" />
                  <Group>
                    <Clapperboard size={20} strokeWidth={1.2} className="text-[#18BDBE]" />
                    <Text size="sm" c={"gray"}>
                      {element.scenes.length || 0}
                    </Text>
                  </Group>
                  <Divider orientation="vertical" />
                  <Group>
                    <CircleHelp size={20} strokeWidth={1.2} className="text-[#18BDBE]" />
                    <Text size="sm" c={"gray"}>
                      {element.questions.length || 0}
                    </Text>
                  </Group>
                </Group>
              </Stack>
              <Group mt={"sm"} align="center" justify="space-between" wrap="nowrap" gap="xs">
                <Text
                  size="sm"
                  c="dimmed"
                  ta="center"
                  style={{ flex: 1, minWidth: 0 }}
                  lineClamp={1}
                  title={
                    element.status === "New"
                      ? t("programs.list-status-new")
                      : element.status === "Updated"
                        ? t("programs.list-status-updated")
                        : t("programs.list-status-none")
                  }>
                  {element.status === "New"
                    ? t("programs.list-status-new")
                    : element.status === "Updated"
                      ? t("programs.list-status-updated")
                      : t("programs.list-status-none")}
                </Text>
                <div
                  className="h-4 w-12 shrink-0 rounded"
                  style={{
                    background: element.color,
                  }}></div>
              </Group>
            </Card>
          )
        })}
      </SimpleGrid>
    </>
  )
}

export default RenderPrograms
