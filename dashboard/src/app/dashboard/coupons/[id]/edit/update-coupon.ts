import AmanApi from "@/services/aman"

export const PutUpdateCoupon = async ({ id, ...data }: unknown & { id: string }) => {
  const response = await AmanApi.put(`/coupons/${id}`, data)
  return response.data
}
