import { WEBSITE_LANGS } from "@/config"
import { Coupon } from "../types"
import { Meta } from "../../types"

export interface CouponResponse {
  status: boolean
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: null
}

export interface Data {
  item: Coupon
}

export interface GetCouponGraphResponse {
  status: boolean
  message: string
  data: Data
  guard: string
  errors: null
  response_code: number
  request_body: null
}

export interface Data {
  graph: Graph
}

export interface Graph {
  references: { [key: string]: string }
  all_time: AllTime[]
  hourly: AllTime[]
  daily: AllTime[]
  weekly: AllTime[]
  monthly: AllTime[]
  yearly: AllTime[]
  custom: AllTime[]
}

export interface AllTime {
  "1": number
  "2": number
  "3": number
  x: string
}

export interface UsersInfoResponse {
  status: boolean
  message: string
  data: {
    helpers: null
    items: {
      data: User[]
      meta: Meta
    }
  }
  guard: string
  errors: null
  response_code: number
}

export interface User {
  id: string
  price: string
  percentage: string
  video_title: string
  number_of_time_used: string
  created_at: Date
  user: {
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
}
