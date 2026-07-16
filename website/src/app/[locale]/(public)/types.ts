export interface CountriesResponse {
  status: boolean
  local: string
  message: string
  data: { [key: string]: Country }
  guard: null
  errors: null
  response_code: number
  local_language: string
  request_body: any[]
}

export interface Country {
  Name: {
    en: string
    ar: string
    fr: string
    id: string
  }
  Id: string
  Flag: string
  Value: number
  ValueRaw: number
}

export interface RatesResponse {
  status: boolean
  local: string
  message: string
  data: Data
  guard: null
  errors: null
  response_code: number
  local_language: string
  request_body: RequestBody
}

export interface Data {
  helpers: Helpers
  items: Items
}

export interface Helpers {
  averages: Averages
}

export interface Averages {
  rate_1: number
  rate_2: number
  rate_3: number
  rate_4: number
}

export interface Items {
  data: Rate[]
  links: Links
  meta: Meta
}

export interface Rate {
  id: string
  code_number: string
  user_id: string
  user_name: string
  user_email: string
  user_mobile: string
  video_id: string
  video_title: string
  user_video_id: string
  rate_1: string
  rate_2: string
  rate_3: string
  rate_4: string
  comment: string
  created_at: string
  deleted_at: null
  is_active: string
  user: User
}

export interface User {
  id: string
  mobile: string
  first_name: string
  last_name: string
  full_name: string
  lang: string
  certificate_count: string
  email: string
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

export interface RequestBody {
  per_page: number
  page: number
  sort_column: string
  sort_direction: string
  date_from: string
  date_to: string
  dateFrom: string
  dateTo: string
}
