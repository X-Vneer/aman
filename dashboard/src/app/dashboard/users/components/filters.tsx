import { WEBSITE_LANGS } from "@/config"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { getVideos } from "@/services/utils/get-videos"
import { cn } from "@/utils/cn"
import { Button, Checkbox, Divider, Popover, Stack } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { SlidersHorizontal } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const Filters = () => {
  const { data: videos } = useQuery({
    queryKey: ["list", "videos"],
    queryFn: () => getVideos(),
  })
  const { t } = useTranslation()
  const [filters, setFilters] = useQueryStates({
    "langs[]": parseAsArrayOf(parseAsString).withDefault([]),
    "video_ids[]": parseAsArrayOf(parseAsString).withDefault([]),
  })
  const [state, setState] = useState<{ "langs[]": string[]; "video_ids[]": string[] }>(filters)
  const handleApplyFilters = () => {
    setFilters(state)
  }
  const handleChange = (key: "langs[]" | "video_ids[]", value: string[]) => {
    setState((pre) => ({ ...pre, [key]: value }))
  }
  const sm = useSmallScreen()
  return (
    <Popover width={sm ? 200 : 250} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className={cn(
            "!border !border-gray-300",
            (filters["langs[]"].length !== 0 || filters["video_ids[]"].length !== 0) && "!border-secondary",
          )}
          color="#5A5A5A"
          size="sm"
          leftSection={sm ? null : <SlidersHorizontal size={20} />}>
          {sm ? <SlidersHorizontal size={20} /> : t("global.filters")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="!border-none">
        <Stack gap={"sm"}>
          <Checkbox.Group
            value={state["langs[]"]}
            onChange={(value) => {
              handleChange("langs[]", value)
            }}
            label={t("users.filters.langs.title")}>
            <Stack gap={"sm"} mt="xs">
              {WEBSITE_LANGS.map((lang) => (
                <Checkbox
                  key={lang}
                  radius={"sm"}
                  size="sm"
                  color="secondary"
                  value={lang}
                  label={t(`langs.${lang}`)}
                />
              ))}
            </Stack>
          </Checkbox.Group>
          <Checkbox.Group
            value={state["video_ids[]"]}
            onChange={(value) => {
              handleChange("video_ids[]", value)
            }}
            label={t("users.filters.programs.title")}>
            <Stack gap={"xs"} mt="xs">
              {videos
                ? [{ id: "0", title: t("not-completed") }, ...videos]?.map((video) => {
                    return (
                      <Checkbox
                        key={video.id}
                        radius={"sm"}
                        size="sm"
                        color="secondary"
                        value={video.id + ""}
                        c={"gray"}
                        label={video.title}
                      />
                    )
                  })
                : null}
            </Stack>
          </Checkbox.Group>
          <Divider />
          <Button size="sm" onClick={handleApplyFilters}>
            {t("global.apply")}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default Filters
