import { z } from "zod"

export const storiesSchema = z
  .object({
    first_name: z.string({ error: "required" }).min(1, "required"),
    last_name: z.string({ error: "required" }).min(1, "required"),
    title: z.string({ error: "required" }).min(1, "required"),
    mobile: z.string({ error: "required" }).min(1, "required"),
    age: z.string({ error: "required" }).min(1, "required"),
    email: z.string({ error: "required" }).min(1, "required").email({ message: "invalidEmail" }),
    content: z.string({ error: "required" }).min(1, "required").max(500, "maxLength"),
    hasAttendedProgram: z.string({ error: "required" }).min(1, "required"),
    selectedVideo: z.string().optional(),
    programName: z.string().optional(),
    agreeToDisplay: z.boolean().refine((val) => val === true, { message: "required" }),
  })
  .refine(
    (data) => {
      // If user has attended program, selectedVideo is required
      if (data.hasAttendedProgram === "yes" && !data.selectedVideo) {
        return false
      }
      return true
    },
    {
      message: "required",
      path: ["selectedVideo"],
    },
  )
  .refine(
    (data) => {
      // If user selected "other", programName is required
      if (data.hasAttendedProgram === "other" && !data.programName) {
        return false
      }
      return true
    },
    {
      message: "required",
      path: ["programName"],
    },
  )
