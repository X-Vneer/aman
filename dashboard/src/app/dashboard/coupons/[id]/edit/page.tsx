import usePermissions from "@/hooks/use-permissions"
import { useParams } from "@/lib/i18n/navigation"
import { Stack, Title } from "@mantine/core"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Space } from "lucide-react"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"
import AddCouponForm from "../../add/components/form"
import { GetCoupon } from "../get-coupon"

const EditCoupon = () => {
  const { t } = useTranslation()
  const searchParams = useOptimisticSearchParams()
  const { id } = useParams() as { id: string }
  const {
    data: coupon,
    error,
    isFetching,
  } = useSuspenseQuery({
    queryKey: ["coupon", id],
    queryFn: () => GetCoupon(id, searchParams),
  })
  if (error && !isFetching) {
    throw error
  }

  const hasPermissionTo = usePermissions()

  return (
    <Stack>
      <Title order={2}>{t("coupons.edit.title")}</Title>
      <Space />
      {hasPermissionTo("Coupon:Edit") ? <AddCouponForm coupon={coupon} /> : null}
    </Stack>
  )
}

export default EditCoupon
