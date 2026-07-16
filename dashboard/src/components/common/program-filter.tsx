import { useSmallScreen } from "@/hooks/use-small-screen"
import { getVideos } from "@/services/utils/get-videos"
import { cn } from "@/utils/cn"
import { Button, Checkbox, Popover, Stack } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import { SlidersHorizontal } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const ProgramFilter = () => {
  const { t } = useTranslation()

  const { data: videos } = useQuery({
    queryKey: ["list", "videos"],
    queryFn: () => getVideos(),
  })
  const [programs, setPrograms] = useQueryState("video_ids[]", parseAsArrayOf(parseAsString).withDefault([]))
  const [state, setState] = useState<string[]>([])
  const handleApplyFilters = () => {
    setPrograms(state)
  }

  const sm = useSmallScreen()
  return (
    <Popover width={sm ? 200 : 250} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button
          variant="white"
          className={cn("!border !border-gray-300", programs.length !== 0 && "!border-secondary")}
          color="#5A5A5A"
          size={sm ? "xs" : "sm"}
          leftSection={<SlidersHorizontal size={sm ? 17 : 20} />}>
          {t("global.programs")}
        </Button>
      </Popover.Target>
      <Popover.Dropdown className="!border-none">
        <Stack gap={"sm"}>
          <Checkbox.Group value={state} onChange={setState} label={t("users.filters.programs.title")}>
            <Stack gap={"xs"} mt="xs">
              {videos?.map((video) => {
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
              })}
            </Stack>
          </Checkbox.Group>

          <Button size="sm" onClick={handleApplyFilters}>
            {t("global.apply")}
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  )
}

export default ProgramFilter
