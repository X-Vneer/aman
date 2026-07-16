import Error from "@/components/common/error"
import Loader from "@/components/common/loader"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Group, Paper, Stack, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"
import AddAdmin from "./components/add-admin"
import ListAdmins from "./components/list-admins"
import PermissionsForm from "./components/permissions-form"
import { GetAdmins } from "./get-admins"

export default function Permissions() {
  const { t } = useTranslation()
  const sm = useSmallScreen()

  const searchParams = useOptimisticSearchParams()
  const newSearchParams = new URLSearchParams(searchParams)
  newSearchParams.delete("selected")
  const selectedId = searchParams.get("selected")
  const { data, error, status } = useQuery({
    queryKey: ["admins", newSearchParams.toString()],
    queryFn: async () => {
      return await GetAdmins(newSearchParams)
    },
  })
  if (status === "pending") return <Loader />
  if (status === "error") return <Error error={error} />

  const selectedAdmin = data.items.data.find((admin) => admin.id == selectedId)! || []
  return (
    <Group wrap={sm ? "wrap" : "nowrap"} gap={"xl"} align="start">
      <Paper
        w={sm ? "100%" : "320px"}
        className="shrink-0"
        style={{
          borderColor: "#E2E2E2",
        }}
        component={Stack}
        gap={"lg"}
        withBorder
        p={"md"}>
        <Group gap="xl" justify="space-between">
          <Text fw="500" size="lg">
            {t("permissions.title")}
          </Text>
          <AddAdmin />
        </Group>
        <ListAdmins data={data} />
      </Paper>

      {selectedAdmin ? <PermissionsForm key={selectedId} initialData={selectedAdmin} /> : null}
    </Group>
  )
}
