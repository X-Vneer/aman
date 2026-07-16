import { SuccessResponse } from "@/@types"
import AmanApi from "@/services/aman"
import { AddAwareness } from "./@types"

export const GetSingleAwareness = async ({ id }: { id: string }) => {
  const response = await AmanApi.get<SuccessResponse<AddAwareness>>(`/awareness/${id}/edit`)
  return response
}
