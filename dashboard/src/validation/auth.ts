import i18n from "@/lib/i18n"
import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string({ error: "required" }).min(1, "required").email("invalidEmail"),
  password: z.string({ error: "required" }).min(6, "shortPassword").max(32, "longPassword"),
})
export const OTPSchema = z.object({
  otp: z.string({ error: "required" }).min(4, "required"),
})

export const ResetPasswordSchema = z
  .object({
    password: z.string({ error: "required" }).min(6, "shortPassword").max(32, "longPassword"),
    password_confirmation: z.string({ error: "required" }).min(6, "shortPassword").max(32, "longPassword"),
    otp: z.string({ error: "required" }).min(4, "required"),
  })
  .refine((obj) => obj.password === obj.password_confirmation, {
    path: ["password_confirmation"],
    message: i18n.t(`global.errors.noMatch`),
  })
