import AmanApi from "@/services/aman"
import { ContactsResponse } from "./types"

export const GetContacts = async (params: URLSearchParams) => {
  const response = await AmanApi.get<ContactsResponse>(`/contacts`, {
    params,
  })
  return response.data.data
}
