import AmanApi from "@/services/aman"

type Args = {
  data: { reply: string }
  id: string
}
export const PostReply = async ({ id, data }: Args) => {
  const response = await AmanApi.post(`/contacts/${id}/reply`, data)
  return response.data
}
