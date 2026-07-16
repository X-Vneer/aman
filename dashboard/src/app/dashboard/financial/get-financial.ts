import AmanApi from "@/services/aman"
import { UsersInfoResponse } from "../types"

export const GetUsersInfo = async (params: URLSearchParams) => {
  const response = await AmanApi.get<UsersInfoResponse>(`/financial-management/user-information`, {
    params,
  })

  return response.data.data
}
