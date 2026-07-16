import AmanApi from "@/services/aman"
import { Contact } from "./types"

export interface ContactResponse {
  status: boolean
  message: string
  data: {
    item: Contact
  }
  guard: string
  errors: null
  response_code: number
}

export const GetContact = async (id: string) => {
  const response = await AmanApi.get<ContactResponse>(`/contacts/${id}`)
  return response.data.data.item
}

