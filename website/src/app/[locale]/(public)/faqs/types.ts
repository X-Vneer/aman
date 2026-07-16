export interface FAQResponse {
  status: boolean
  message: string
  data: Data
  guard: null
  errors: null
  response_code: number
}

export interface Data {
  helpers: null
  items: Items
}

export interface Items {
  data: FAQ[]
  links: Links
  meta: Meta
}

export interface FAQ {
  id: string
  title: string
  description: string
  deleted_at: null
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
