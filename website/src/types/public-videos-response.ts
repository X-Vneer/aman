export interface VideosResponse {
  status: boolean
  message: string
  data: Data
  guard: null
  errors: null
  response_code: number
}

export interface Data {
  helpers: Helpers

  items: Items
}

export interface Helpers {
  introduction: Introduction
}

export interface Introduction {
  title: string
  description: string
}

export interface Items {
  data: Video[]
  links: Links
  meta: Meta
}

export interface Video {
  id: string
  video_url: string
  logo: string
  title: string
  description: string
  length: string
  deleted_at: null
  is_new: boolean
  /** Admin program badge: `New`, `Updated`, or null when cleared */
  status?: "New" | "Updated" | null
  view_count: number
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
