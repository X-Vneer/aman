import { z } from "zod"

export const couponFormSchema = z.object({
  gender: z.string().min(1, "required"),
  age: z.string().min(1, "required").max(150),
  sector: z.string().min(1, "required"),
  workplace: z.string().min(1, "required"),
  nationality: z.string().min(1, "required"),
})
