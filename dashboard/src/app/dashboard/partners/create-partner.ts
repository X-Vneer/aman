import AmanApi from "@/services/aman"
import { Partner } from "./types"

export const PostCreatePartner = async (data: Omit<Partner, "id" | "createdAt" | "updatedAt">) => {
  const response = await AmanApi.post("/partners", data)
  return response.data
}
