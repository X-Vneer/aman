import AmanApi from "@/services/aman"
import { AdminSchema } from "@/validation/admins-schema"
import { z } from "zod"

export const PutUpdateAdmin = async (
  id: string,
  data: Omit<z.infer<typeof AdminSchema>, "permissions"> & { permissions: string[] },
) => {
  const response = await AmanApi.put(`/admins/${id}`, data)
  return response.data
}
