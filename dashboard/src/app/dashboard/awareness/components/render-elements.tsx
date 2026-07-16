import Loader from "@/components/common/loader"
import usePermissions from "@/hooks/use-permissions"
import { Link } from "@/lib/i18n/navigation"
import { Card, Group, SimpleGrid, Stack, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"
import { GetAwareness } from "../get-awareness"
import DeleteAwarenessComponent from "./delete-awareness"

const RenderElements = () => {
  const { t } = useTranslation()
  const hasPermissionTo = usePermissions()

  const searchParams = useOptimisticSearchParams()

  const { data, error, status } = useQuery({
    queryKey: ["awareness", searchParams.toString()],
    queryFn: async () => await GetAwareness(searchParams),
  })

  if (status === "pending") return <Loader />
  if (status === "error") return <div>error</div>

  return (
    <>
      <div className="h-5"></div>
      <SimpleGrid cols={{ base: 1, sm: 3, md: 2, lg: 3 }} spacing={20}>
        {data.map((element) => {
          return (
            <Card padding="md" radius="md">
              <Stack>
                <Text fw={500}>{element.video_title}</Text>
                <Group justify="space-between">
                  {hasPermissionTo("Awareness:Edit") ? (
                    <Text component={Link} to={`/dashboard/awareness/${element.id}`} lineClamp={2}>
                      {element.title}
                    </Text>
                  ) : (
                    <Text lineClamp={2}>{element.title}</Text>
                  )}

                  {hasPermissionTo("Awareness:Delete") ? <DeleteAwarenessComponent {...element} /> : null}
                </Group>
              </Stack>
            </Card>
          )
        })}
      </SimpleGrid>
    </>
  )
}

export default RenderElements
