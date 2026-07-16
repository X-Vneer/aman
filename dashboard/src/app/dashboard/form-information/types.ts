import { WEBSITE_LANGS } from "@/config"
import { Coupon } from "../coupons/types"

export interface UsersResponse {
  status: boolean
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: RequestBody
}

export interface Data {
  helpers: null
  items: Items
}

export interface Items {
  data: User[]
  links: Links
  meta: Meta
}

export interface User {
  id: string
  mobile: string
  first_name: null | string
  last_name: null | string
  full_name: null | string
  lang: (typeof WEBSITE_LANGS)[number]
  certificate_count: string
  email: null | string
  deleted_at: null
  userVideos: UserVideo[]
  coupons?: (string | Coupon)[]
  info: {
    id: string
    gender: string
    age: string | null
    nationality: string
    sector: string
    workplace: string
  }
}

export interface UserVideo {
  video_id: string
  video_title: string
  answer_average: string
  total_questions: string
  correct_answers: string
  evaluation: string
  current_time: string
  video_played: string
  coupon_code: string
  price: string
  paid: string | null
  certificate_url: null | string
  certificate_number: string | null
  is_certificate_generated: boolean
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
  id: null
  email: null
}
