import AmanApi from "@/services/aman"
import { UsersInfoResponse } from "./types"

export const GetUsers = async (id: string, params: URLSearchParams) => {
  const response = await AmanApi.get<UsersInfoResponse>(`/coupons/${id}/users`, { params })
  return response.data.data
}
