import { VideoColorsResponse } from "@/@types/colors"
import AmanApi from "@/services/aman"
import { useQuery } from "@tanstack/react-query"

const useColors = () => {
  return useQuery({
    queryFn: async () => {
      const response = await AmanApi.get<VideoColorsResponse>(`/videos/colors`)
      return response.data.data.items.id
    },
    queryKey: ["colors"],
    staleTime: Infinity,
  })
}

export default useColors
