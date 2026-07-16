import ActiveFiltersBar from "@/components/common/active-filters-bar"
import { useReviewsActiveFilterChips } from "@/hooks/use-dashboard-active-filter-chips"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { Alert, Group, Space, Stack, Title } from "@mantine/core"
import { TriangleAlert } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import TableCom from "./components/table"
import SearchInput from "@/components/ui/search-input"
import ExportButton from "@/components/common/export-button"
import DateFilter from "./components/date-filter"
import { GetReviews } from "./get-reviews"
import Filters from "./components/filters"
import CouponCodeFilter from "./components/coupon-code-filter"
import UserFilter from "./components/user-filter"
import RateFilter from "./components/rate-filter"

const Reviews = () => {
  const { t } = useTranslation()
  const sm = useSmallScreen()
  const activeFilterChips = useReviewsActiveFilterChips()
  const [couponCode] = useQueryState("coupon_code", parseAsString.withDefault(""))
  const [showCouponNotice, setShowCouponNotice] = useState(true)

  return (
    <Stack>
      <Title
        className="ltr:font-customEnglish! ltr:font-normal! ltr:italic!"
        size={sm ? "h3" : "h2"}
        order={2}>
        {t("reviews.title")}
      </Title>
      <Space />
      <Group justify="space-between" gap={"lg"} wrap="nowrap">
        <SearchInput key="comment" placeholder={t("reviews.comment-filter")} />
        <Group>
          <CouponCodeFilter />
          <UserFilter />
          <RateFilter />
          <DateFilter />
          <Filters />
          <ExportButton queryFun={GetReviews} filename="reviews" />
        </Group>
      </Group>
      <ActiveFiltersBar chips={activeFilterChips} />
      {couponCode && showCouponNotice ? (
        <Alert
          color="yellow"
          variant="light"
          icon={<TriangleAlert size={18} />}
          withCloseButton
          onClose={() => setShowCouponNotice(false)}>
          {t("reviews.coupon-filter-notice")}
        </Alert>
      ) : null}

      <TableCom />
    </Stack>
  )
}

export default Reviews
