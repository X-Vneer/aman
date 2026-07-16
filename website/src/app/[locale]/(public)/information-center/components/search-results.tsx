"use client"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { GetSearch } from "../search"
import OldSearch from "./old-search"
import SearchResultItem from "./search-result-item"
import { Spinner } from "@heroui/react"
import { useQueryState } from "nuqs"

const SearchResults = () => {
  const [query] = useQueryState("q")

  const { data: results, status } = useQuery({
    queryKey: ["information-center-search", query],
    queryFn: () => GetSearch(query!),
    staleTime: Infinity,
    enabled: !!query,
  })

  if (!query)
    return (
      <div className="space-y-4">
        <OldSearch />
      </div>
    )
  if (status === "pending")
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  if (status === "error")
    return (
      <div className="flex justify-center py-20">
        <p className="text-danger">Error fetching search results. Please try again later.</p>
      </div>
    )

  return (
    <div className="space-y-4">
      <SearchResultItem results={results} />
    </div>
  )
}

export default SearchResults
