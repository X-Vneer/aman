import { Space, Stack, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
import AddEditCouponForm from "./components/form"

const AddCoupon = () => {
  const { t } = useTranslation()
  return (
    <Stack>
      <Title order={2}>{t("coupons.add.title")}</Title>
      <Space />
      <AddEditCouponForm />
    </Stack>
  )
}

export default AddCoupon
