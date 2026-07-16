import AmanApi from "@/services/aman"
import { AdminsResponse } from "./type"

export const GetAdmins = async (params: URLSearchParams) => {
  const response = await AmanApi.get<AdminsResponse>(`/admins`, {
    params,
  })
  return response.data.data
}
