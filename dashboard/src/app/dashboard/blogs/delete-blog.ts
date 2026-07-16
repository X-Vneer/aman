import AmanApi from "@/services/aman"

export const DeleteBlog = async ({ id }: { id: string }) => {
  const response = await AmanApi.delete(`/blogs/${id}`)
  return response.data
}
