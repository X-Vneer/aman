import AmanApi from "@/services/aman"
import { Partner } from "./types"

export const TogglePartnerActivity = async ({ id, isHidden }: { id: string; isHidden: boolean }) => {
  const response = await AmanApi.put<{ data: { item: Partner } }>(
    `/partners/${id}/toggleActive/${isHidden.toString()}`,
  )
  return response.data.data.item
}
