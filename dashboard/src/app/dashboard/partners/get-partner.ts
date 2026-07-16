import AmanApi from "@/services/aman"
import { PartnerResponse } from "./types"

export const GetPartner = async ({ id }: { id: string }) => {
  const response = await AmanApi.get<PartnerResponse>(`/partners/${id}`)
  return response.data.data.item
}
