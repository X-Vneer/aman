export interface FinancialStatisticsResponse {
  status: boolean
  local: string
  message: string
  data: {
    total_revenue: string
    total_tax_value: string
    total_discount_value: string
    videos_revenue: VideosRevenue[]
  }
  guard: string
  errors: null
  response_code: number
  request_body: unknown[]
}

export interface VideosRevenue {
  video_id: number
  price_original: string
  price: number
  title: string
  revenue: number | string
  tax_value: number | string
  discount_value: number | string
}

export interface VideoGraphResponse {
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
  references: Record<string, { label: string; color: string }>
  hourly: DataGraph[]
  daily: DataGraph[]
  weekly: DataGraph[]
  monthly: DataGraph[]
  yearly: DataGraph[]
  custom: DataGraph[]
}

export interface DataGraph {
  "1": number
  "2": number
  x: string
  y: number
}
