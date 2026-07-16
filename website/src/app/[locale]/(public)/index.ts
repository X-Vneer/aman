import { AmanApiGuest } from "@/services/aman"
import { CountriesResponse, RatesResponse } from "./types"

export const getCountriesStatistics = async () => {
  const response = await AmanApiGuest.get<CountriesResponse>("/map/country-statistics")
  return response.data.data
}

export const getRates = async ({ per_page = 100, page = 1 }: { per_page?: number; page?: number }) => {
  const response = await AmanApiGuest.get<RatesResponse>("/rates", {
    params: {
      per_page,
      page,
    },
  })
  return response.data.data
}
