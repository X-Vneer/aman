import { WEBSITE_LANGS } from "@/config"
import type { CreateBlogInput } from "@/validation/blogs"
import type { Blog, BlogLangs } from "../types"

function emptyLangs(): BlogLangs {
  return WEBSITE_LANGS.reduce(
    (acc, lang) => {
      acc[lang] = ""
      return acc
    },
    {} as BlogLangs,
  )
}

export function emptyCreateBlogValues(): CreateBlogInput {
  return {
    title: emptyLangs(),
    short_description: emptyLangs(),
    content: emptyLangs(),
    publish_date: "",
    logo: "",
    tags: [],
  }
}

export function blogToFormValues(blog: Blog): CreateBlogInput {
  const base = emptyCreateBlogValues()
  return {
    ...base,
    title: { ...base.title, ...blog.title },
    short_description: { ...base.short_description, ...blog.short_description },
    content: { ...base.content, ...blog.content },
    publish_date: blog.publish_date ? blog.publish_date.slice(0, 10) : "",
    logo: blog.logo ?? "",
    tags: blog.tags?.map((tag) => tag.slug || tag.name).filter(Boolean) ?? [],
  }
}
