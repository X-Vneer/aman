import { z } from "zod"
import phoneNumberSchema from "./phone-number"

export const UserSchema = z.object({
  first_name: z.string({ error: "required" }).min(1, "required"),
  last_name: z.string({ error: "required" }).min(1, "required"),
  mobile: phoneNumberSchema,
  email: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => value === null || value === "" || z.string().email("invalidEmail").safeParse(value).success,
    ),
})
