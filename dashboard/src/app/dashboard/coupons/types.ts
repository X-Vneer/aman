export interface CouponsResponse {
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
  data: Coupon[]
  links: Links
  meta: Meta
}

export interface Coupon {
  id: string
  name: string
  code: string
  type: "Percentage" | "Fixed"
  amount: string
  date_start: Date
  date_end: Date
  max_uses: string
  max_customer_uses: string
  uses_count: string
  paid_amount: string
  paid_amount_after_discount: string
  discount_amount: string
  number_of_users: string
  status: "Active" | "Inactive" | "Expired"
  deleted_at: null
  video_ids: number[]
  langs: string[]
  has_form: boolean
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
  statuses: string[]
}
