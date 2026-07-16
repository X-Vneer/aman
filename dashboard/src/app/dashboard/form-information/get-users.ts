import AmanApi from "@/services/aman"
import { UsersResponse } from "./types"

export const GetUsers = async (params: URLSearchParams) => {
  const response = await AmanApi.get<UsersResponse>(`/users`, {
    params,
  })
  return response.data.data
}
