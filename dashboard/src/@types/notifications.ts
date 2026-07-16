export interface NotificationsResponse {
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
  data: Notification[]
  links: Links
  meta: Meta
}

export interface Notification {
  id: string
  title_id: string
  notificationable_id: number
  created_at: Date
  user: User | null
  notificationable: Notificationable | null
}

export interface Notificationable {
  video_id?: string
  video_title?: string
  answer_average?: string
  total_questions?: string
  correct_answers?: string
  evaluation?: null
  current_time?: string
  video_played?: string
  coupon_code?: string
  price?: string
  paid?: string
  certificate_url?: null
  certificate_number?: null
  is_certificate_generated?: boolean
  id?: string
  type?: string
  name?: string
  email?: string
  subject?: string
  message?: string
  reply?: null
  status?: string
  created_at?: Date
  deleted_at?: null
}

export interface User {
  id: string
  mobile: string
  first_name: null
  last_name: null
  full_name: null
  lang: string
  certificate_count: string
  email: null
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
}
