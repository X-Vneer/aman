import AmanApi from "@/services/aman"

export const PostToggleReviewActive = async ({
  contactId,
  status,
}: {
  contactId: string
  status: "true" | "false"
}) => {
  const response = await AmanApi.put(`/rates/${contactId}/toggleActive/${status}`)
  return response.data
}
