import AmanApi from "@/services/aman"
import { CouponsResponse } from "./types"

export const GetCoupons = async (params: URLSearchParams) => {
  const response = await AmanApi.get<CouponsResponse>(`/coupons`, {
    params,
  })
  return response.data.data
}
