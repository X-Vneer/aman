export interface ReviewsResponse {
  status: boolean
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: RequestBody
}

export interface Data {
  helpers: {
    averages: {
      rate_1: number
      rate_2: number
      rate_3: number
      rate_4: number
    }
  }
  items: Items
}

export interface Items {
  data: Datum[]
  links: Links
  meta: Meta
}

export interface Datum {
  id: string
  code_number: string
  user_id: string
  video_id: string
  video_title: string
  user_video_id: string
  rate_1: string
  rate_2: string
  rate_3: string
  rate_4: string
  comment: string
  user: User
  is_active: "1" | "0"
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
  date_from: Date
  date_to: Date
}
