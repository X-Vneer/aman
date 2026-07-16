import { WEBSITE_LANGS } from "@/config"

export type BlogLangs = Record<(typeof WEBSITE_LANGS)[number], string>

export interface BlogsResponse {
  status: boolean
  local: string
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  local_language: string
  request_body: RequestBody
}

export interface Data {
  helpers: null
  items: Items
}

export interface Items {
  data: Blog[]
  links: Links
  meta: Meta
}

export interface Blog {
  id: string
  title: BlogLangs
  short_description: BlogLangs
  content: BlogLangs
  publish_date: string
  logo: string
  is_active: string
  created_at: string
  updated_at: string
  deleted_at: null
  tags: Tag[]
}

export interface Tag {
  id: number
  name: string
  slug: string
  color: null
}

export interface Links {
  first: string
  last: string
  prev: null
  next: null
}

export interface Meta {
  current_page: number
  from: number
  last_page: number
  links: Link[]
  path: string
  per_page: number
  to: number
  total: number
}

export interface Link {
  url: null | string
  label: string
  active: boolean
}

export interface RequestBody {
  per_page: number
  page: number
  sort_direction: string
  date_from: string
  date_to: string
  title: null
  dateFrom: string
  dateTo: string
}
