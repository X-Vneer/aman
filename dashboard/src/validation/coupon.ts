import { z } from "zod"

export const CouponSchema = z
  .object({
    code: z.string({ error: "required" }).min(1, "required").max(50, "long"),
    name: z.string({ error: "required" }).min(1, "required").max(50, "long"),
    amount: z.coerce.number({ error: "required" }),
    video_ids: z.array(z.string()).optional(), // Array of video IDs; ensure these IDs exist in your videos table
    date_start: z.coerce.date({ error: "required" }),
    date_end: z.coerce.date({ error: "required" }), // Must be after date_start and in the correct format
    max_uses: z.string().min(1, "smallNumber").regex(/^\d+$/, "invalidNumber"), // Must be a number and max 100000
    max_customer_uses: z.string().min(1, "smallNumber").regex(/^\d+$/, "invalidNumber"), // Number of uses per customer, must be less than 1000
    type: z.string(), // Must be one of the defined CouponType values
    langs: z.array(z.string()).optional(), // Must be one or more of the defined Lang values
    has_form: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.date_end > data.date_start) return true
      return false
    },
    {
      path: ["date_start"],
      message: "invalidDate",
    },
  )
