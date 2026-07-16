import AmanApi from "@/services/aman"
import { UsersInfoResponse } from "./types"

export const GetUsersInfo = async (params: URLSearchParams) => {
  const response = await AmanApi.get<UsersInfoResponse>(`/home/user-information`, {
    params,
  })

  return response.data.data
}
