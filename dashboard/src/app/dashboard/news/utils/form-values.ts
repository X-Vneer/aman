import { WEBSITE_LANGS } from "@/config"
import type { CreateNewsInput } from "@/validation/news"
import type { NewsItem, NewsLangs } from "../types"

function emptyLangs(): NewsLangs {
  return WEBSITE_LANGS.reduce(
    (acc, lang) => {
      acc[lang] = ""
      return acc
    },
    {} as NewsLangs,
  )
}

export function emptyCreateNewsValues(): CreateNewsInput {
  return {
    title: emptyLangs(),
    short_description: emptyLangs(),
    content: emptyLangs(),
    publish_date: "",
    logo: "",
    tags: [],
  }
}

export function newsToFormValues(news: NewsItem): CreateNewsInput {
  const base = emptyCreateNewsValues()
  return {
    ...base,
    title: { ...base.title, ...news.title },
    short_description: { ...base.short_description, ...news.short_description },
    content: { ...base.content, ...news.content },
    publish_date: news.publish_date ? news.publish_date.slice(0, 10) : "",
    logo: news.logo ?? "",
    tags: news.tags?.map((tag) => tag.slug || tag.name).filter(Boolean) ?? [],
  }
}
