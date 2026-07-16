export interface AdditionalPartnersResponse {
  status: boolean
  local: string
  message: string
  data: Data
  guard: null
  errors: null
  response_code: number
  request_body: RequestBody
}

export interface Data {
  helpers: null
  items: Items
}

export interface Items {
  data: Partner[]
  links: Links
  meta: Meta
}

export interface Partner {
  id: string
  name: string
  logo: string
  createdAt: string
  updatedAt: string
  created_at: string
  updated_at: string
  deleted_at: null
  isActive: boolean
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
