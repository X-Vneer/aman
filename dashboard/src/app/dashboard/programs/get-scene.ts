import AmanApi from "@/services/aman"
import { SceneResponse, VideoResponse } from "./@types"

export const GetScene = async ({ id }: { id: string }) => {
  const response = await AmanApi.get<SceneResponse>(`/scenes/${id}/edit`)
  return response
}
