import { AmanApiGuest } from "@/services/aman"
import { InfoCenterResponse } from "./types"

export const GetSearch = async (q: string) => {
  const response = await AmanApiGuest.get<InfoCenterResponse>(`/certificates/${q}`)

  return response.data.data.items
}
