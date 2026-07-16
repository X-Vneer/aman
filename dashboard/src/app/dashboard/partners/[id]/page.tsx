import { Stack } from "@mantine/core"
import PartnerForm from "../components/partner-form"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { GetPartner } from "../get-partner"
import Loader from "@/components/common/loader"

const AddPartner = () => {
  const params = useParams() as { id: string }
  const { t } = useTranslation()
  const { data, status } = useQuery({
    queryKey: ["partners", params.id],
    queryFn: async () => {
      const response = await GetPartner({ id: params.id })
      return response
    },
  })

  if (status === "pending") return <Loader />
  if (status === "error") return <div>error</div>
  const initialValues = {
    name: data.name,
    logo: data.logo,
    is_active: data.isActive,
  }

  return (
    <Stack>
      <PartnerForm initialValues={initialValues} />
    </Stack>
  )
}

export default AddPartner
