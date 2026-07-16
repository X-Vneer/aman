export interface Partner {
  id: number
  name: string
  logo: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface PartnersResponse {
  data: {
    items: {
      data: Partner[]
      meta: {
        current_page: number
        last_page: number
        per_page: number
        total: number
      }
    }
  }
}

export interface PartnerResponse {
  data: {
    item: Partner
  }
}
