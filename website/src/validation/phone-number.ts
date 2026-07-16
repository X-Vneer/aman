import { z } from "zod"

const phoneNumberSchema = z
  .string({ error: "required" })
  .min(1, { message: "required" })
  .refine(
    (value) => {
      // Remove all non-digit characters to count only digits
      const digitCount = value.replace(/\D/g, "").length

      // Validate that the number has between 10 and 13 digits
      return digitCount >= 10 && digitCount <= 13
    },
    {
      message: "invalidPhoneNumber",
    },
  )

export default phoneNumberSchema
