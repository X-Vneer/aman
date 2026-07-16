import AmanApi from "@/services/aman"

export const PutUpdatePrice = async (data: {
  prices: {
    video_id: number
    price: number
  }[]
}) => {
  const response = await AmanApi.put(`/financial-management/videos/price/update`, data)
  return response.data
}
