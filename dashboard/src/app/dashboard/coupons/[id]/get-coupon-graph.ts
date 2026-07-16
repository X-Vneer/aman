import AmanApi from "@/services/aman"
import { GetCouponGraphResponse } from "./types"

export const GetCouponGraph = async (id: string, params?: URLSearchParams) => {
  const response = await AmanApi.get<GetCouponGraphResponse>(`/coupons/${id}/graph`, {
    params,
  })
  return response.data.data.graph
}
