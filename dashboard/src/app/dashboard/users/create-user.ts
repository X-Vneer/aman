import AmanApi from "@/services/aman"
import { UserSchema } from "@/validation/user"
import { z } from "zod"

export const PostCreateUser = async (data: z.infer<typeof UserSchema>) => {
  const response = await AmanApi.post("/users", data)
  return response.data
}
