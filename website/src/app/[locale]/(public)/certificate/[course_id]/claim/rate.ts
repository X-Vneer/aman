import AmanApi from "@/services/aman"
type Args = {
  video_id: string
  rate_1: number
  rate_2: number
  rate_3: number
  rate_4: number
  comment: string
}
export const PostRate = async (data: Args) => {
  const response = await AmanApi.post(`/user/rates`, data)
  return response
}
