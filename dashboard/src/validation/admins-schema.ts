import { z } from "zod"
import phoneNumberSchema from "./phone-number"

export const AdminSchema = z.object({
  name: z.string({ error: "required" }).min(1, "required"),
  mobile: phoneNumberSchema,
  email: z.email("invalidEmail"),
  role_name: z.string({ error: "required" }).min(1, "required"),
  permissions: z
    .object({
      Overview: z.boolean().default(false),
      Website_Management: z.boolean().default(false),
      Coupon: z.object({
        Add: z.boolean().default(false),
        Edit: z.boolean().default(false),
        Export: z.boolean().default(false),
      }),
      User: z.object({
        Add: z.boolean().default(false),
        Edit: z.boolean().default(false),
        Delete: z.boolean().default(false),
        Export: z.boolean().default(false),
      }),
      Awareness: z.object({
        Add: z.boolean().default(false),
        Edit: z.boolean().default(false),
        Delete: z.boolean().default(false),
      }),
      Programs: z.object({
        Add: z.boolean().default(false),
        Edit: z.boolean().default(false),
        Delete: z.boolean().default(false),
      }),
      Financial: z.object({
        Edit: z.boolean().default(false),
        Export: z.boolean().default(false),
      }),
    })
    .partial(),
})
