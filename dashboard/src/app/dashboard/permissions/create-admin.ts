import AmanApi from "@/services/aman"
import { AdminSchema } from "@/validation/admins-schema"
import { z } from "zod"

export const PostCreateAdmin = async (
  data: Omit<z.infer<typeof AdminSchema>, "permissions"> & { permissions: string[] },
) => {
  const response = await AmanApi.post("/admins", data)
  return response.data
}
