"use client"

import { FieldError, InputGroup, Label, TextField } from "@heroui/react"
import { useTranslations } from "next-intl"
import { parseAsString, useQueryState } from "nuqs"
import React, { useState } from "react"

import Button from "@/components/ui/button"
import { useLocalStorage } from "@mantine/hooks"
import { SearchIcon } from "lucide-react"

type Props = {}

const Search = (props: Props) => {
  const t = useTranslations("information-center.search")
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""))
  const [_, setOldSearch] = useLocalStorage<string[]>({
    key: "information-center-previous-search",
    defaultValue: [],
  })
  const [inputValue, setInputValue] = useState(query || "")
  const [error, setError] = useState<string | null>(null)
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value.trim()
    setInputValue(value)
    if (value) setError("")

    if (!value) setQuery(null)
  }
  const handleSearch = () => {
    if (!inputValue) {
      setError(t("empty-search-error"))
      return
    }
    setQuery(inputValue)
    setOldSearch((pre) => {
      return [inputValue, ...pre.filter((value) => value !== inputValue).slice(-5)]
    })
  }

  const invalid = !!error

  return (
    <div className="flex flex-1 gap-4">
      <TextField isInvalid={invalid} className="min-w-0 flex-1" aria-label={t("input-placeholder")}>
        <Label className="sr-only">{t("input-placeholder")}</Label>
        <InputGroup fullWidth className="rounded-sm">
          <InputGroup.Prefix className="text-default-500">
            <SearchIcon className="size-4 shrink-0" />
          </InputGroup.Prefix>
          <InputGroup.Input
            className="rounded-sm"
            value={inputValue}
            onChange={handleChange}
            placeholder={t("input-placeholder")}
          />
        </InputGroup>
        {invalid ? <FieldError>{error}</FieldError> : null}
      </TextField>
      <Button radius="sm" onClick={handleSearch} size="md" fullWidth={false}>
        {t("search-button")}
      </Button>
    </div>
  )
}

export default Search
