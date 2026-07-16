import AmanApi from "@/services/aman"
import { AwarenessResponse } from "./@types"

export const GetAwareness = async (params?: URLSearchParams) => {
  const response = await AmanApi.get<AwarenessResponse>(`/awareness`, {
    params,
  })
  return response.data.data.items.data
}
