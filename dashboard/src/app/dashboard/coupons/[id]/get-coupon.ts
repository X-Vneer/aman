import AmanApi from "@/services/aman"
import { CouponResponse } from "./types"

export const GetCoupon = async (id: string, params: URLSearchParams) => {
  const response = await AmanApi.get<CouponResponse>(`/coupons/${id}`, { params })
  return response.data.data.item
}
