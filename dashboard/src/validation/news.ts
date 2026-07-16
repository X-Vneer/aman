import { WEBSITE_LANGS } from "@/config"
import { z } from "zod"

const titleField = z.string({ error: "required" }).min(1, "required")
const shortDescriptionField = z.string({ error: "required" }).min(1, "required").max(500, "long")
const contentField = z.string({ error: "required" }).min(1, "required")

function langsObject<T extends z.ZodTypeAny>(field: T) {
  return WEBSITE_LANGS.reduce(
    (acc, lang) => {
      acc[lang] = field
      return acc
    },
    {} as Record<(typeof WEBSITE_LANGS)[number], T>,
  )
}

export const CreateNewsSchema = z.object({
  title: z.object(langsObject(titleField)),
  short_description: z.object(langsObject(shortDescriptionField)),
  content: z.object(langsObject(contentField)),
  publish_date: z.string({ error: "required" }).min(1, "required"),
  logo: z.string({ error: "required" }).min(1, "required").url("invalidUrl"),
  tags: z.array(z.string()),
})

type WebsiteLang = (typeof WEBSITE_LANGS)[number]

export type CreateNewsInput = {
  title: Record<WebsiteLang, string>
  short_description: Record<WebsiteLang, string>
  content: Record<WebsiteLang, string>
  publish_date: string
  logo: string
  tags: string[]
}
