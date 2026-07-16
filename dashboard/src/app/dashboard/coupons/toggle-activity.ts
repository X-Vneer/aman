import AmanApi from "@/services/aman"
import { Coupon } from "./types"

export const PostToggleActivity = async ({ id, status }: { id: string; status: "true" | "false" }) => {
  const response = await AmanApi.put<{ data: { item: Coupon } }>(`/coupons/${id}/toggleActive/${status}`)
  return response.data.data.item
}
