import { useSmallScreen } from "@/hooks/use-small-screen"
import { Stack } from "@mantine/core"
import { useTranslation } from "react-i18next"
import PartnerForm from "../components/partner-form"

const AddPartner = () => {
  return (
    <Stack>
      <PartnerForm />
    </Stack>
  )
}

export default AddPartner
