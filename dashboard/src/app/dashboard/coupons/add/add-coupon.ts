import AmanApi from "@/services/aman"

export const PostAddCoupon = async (data: unknown) => {
  const response = await AmanApi.post("/coupons", data)
  return response.data
}
