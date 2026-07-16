import AmanApi from "@/services/aman"
import { UserResponse } from "./types"

export const GetUser = async (id: string) => {
  const response = await AmanApi.get<UserResponse>(`/users/${id}`)
  return response.data.data.item
}
