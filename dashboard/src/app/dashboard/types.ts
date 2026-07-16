import { WEBSITE_LANGS } from "@/config"

export interface GeneralStatisticsResponse {
  status: boolean
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: unknown[]
}

export interface Data {
  total_certificates: string
  total_revenue: string
  total_users: string
  total_certificates_statistics: TotalCertificatesStatistics[]
}

export interface TotalCertificatesStatistics {
  video_id: string
  x: string
  y: number
}

export interface UserGraphResponse {
  status: boolean
  message: string
  data: {
    graph: Graph
  }
  guard: string
  errors: null
  response_code: number
  request_body: null
}

export interface Graph {
  hourly: ChartData[]
  daily: ChartData[]
  weekly: ChartData[]
  monthly: ChartData[]
  yearly: ChartData[]
  custom?: ChartData[]
}

export interface ChartData {
  x: string
  y: number
  y_ar: number
  y_en: number
  y_fr: number
  y_ur: number
  y_fil: number
  y_id: number
}

export interface RevenueGraphResponse {
  status: boolean
  message: string
  data: {
    graph: {
      hourly: ChartData[]
      daily: ChartData[]
      weekly: ChartData[]
      monthly: ChartData[]
      yearly: ChartData[]
      custom: ChartData[]
    }
  }
  guard: string
  errors: null
  response_code: number
  request_body: null
}

export interface UsersInfoResponse {
  status: boolean
  message: string
  data: {
    helpers: null
    items: {
      data: UserInfo[]
      links: Links
      meta: Meta
    }
  }
  guard: string
  errors: null
  response_code: number
}

export interface UserInfo {
  id: string
  lang: (typeof WEBSITE_LANGS)[number]
  name: string
  program: string
  coupon_code: string
  user: User
  video_id: string
  price: string
  discount_value: string
  tax_value: string
  paid: string

  transaction: Transaction
}

export interface Transaction {
  id: number
  order_id: string | null
  payment_method: string
  payment_status: string
  transaction_date: Date
  reject_reason: null
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
