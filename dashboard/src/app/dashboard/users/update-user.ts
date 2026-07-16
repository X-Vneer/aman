import AmanApi from "@/services/aman"
import { UserSchema } from "@/validation/user"
import { z } from "zod"

export const PutUpdateUser = async ({ id, ...data }: z.infer<typeof UserSchema> & { id: string }) => {
  const response = await AmanApi.put(`/users/${id}`, data)
  return response.data
}
