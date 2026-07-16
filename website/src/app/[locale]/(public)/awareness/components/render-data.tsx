"use client"
import { Label, ListBox, Select } from "@heroui/react"
import { useTranslations } from "next-intl"
import { parseAsString, useQueryState } from "nuqs"
import { Awareness } from "../types"
import { Video } from "@/types/public-videos-response"

type Props = {
  data: Awareness[]
  videos: Video[]
}

const RenderData = ({ data, videos }: Props) => {
  const [selected, setSelected] = useQueryState("course_id", parseAsString.withDefault(videos[0].id))
  const t = useTranslations("awareness")
  const selectedData = data.filter((ele) => ele.video_id == selected) || []

  return (
    <section className="bg-[#1a1919]">
      <div className="container mx-auto max-w-7xl grow px-6 py-12 md:py-20 lg:py-24">
        <div className="flex justify-center">
          <Select
            className="w-full max-w-sm"
            value={selected}
            onChange={(key) => {
              if (key) setSelected(String(key))
            }}>
            <Select.Trigger className="h-12 min-h-12 w-full rounded-lg border border-[#1AD0D1] bg-[#073737] px-3 data-pressed:opacity-90">
              <Select.Value className="flex-1 text-center text-lg text-white" />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className="min-w-(--trigger-width)">
              <ListBox aria-label={t("title")} className="max-h-72 outline-none">
                {videos.map((item) => (
                  <ListBox.Item
                    key={item.id}
                    id={item.id}
                    textValue={item.title}
                    className="cursor-pointer px-3 py-2 text-white data-focused:bg-white/10">
                    <Label>{item.title}</Label>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
        <div className="my-10 space-y-12 md:my-14 md:space-y-16 lg:my-16 lg:space-y-24">
          {selectedData.map((ele, index) => {
            return (
              <div className="space-y-2 md:space-y-3" key={ele.id}>
                <p className="text-center text-xl text-white lg:text-2xl">{ele.title}</p>
                <p className="text-center text-sm text-[#BEB7C8]">{ele.description}</p>
                <div className="mx-auto my-4 w-fit rounded bg-[#000] p-1 px-2 text-center text-sm text-[#BEB7C8]">
                  {t("symptoms")}
                </div>

                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {ele.symptoms.map((e, i) => {
                    return (
                      <div
                        className="rounded-lg bg-[#282828] px-2 py-2.5 text-center text-[#BEB7C8]"
                        key={e + i}>
                        {e}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default RenderData
