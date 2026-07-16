import { z } from "zod"
import phoneNumberSchema from "./phone-number"

export const contactSchema = z.object({
  type: z.enum(["Inquiry", "Complaint", "Suggestion"]),
  email: z.string({ error: "required" }).min(1, "required").email({ message: "invalidEmail" }),
  name: z.string({ error: "required" }).min(1, "required"),
  mobile: phoneNumberSchema,
  message: z.string({ error: "required" }).min(1, "required"),
  subject: z.string({ error: "required" }).min(1, "required"),
  images: z.array(z.string()).max(5, "maxLength").optional(),
  video_title: z.string().optional(),
  video_id: z.string().optional(),
})
