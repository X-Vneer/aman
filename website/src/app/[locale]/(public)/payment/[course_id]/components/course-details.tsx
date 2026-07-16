// import { DummyCoursesData } from "@/data/dummy-courses"
import { Card } from "@heroui/react"
import { Chip } from "@heroui/react"
import { Timer } from "lucide-react"
import { getTranslations } from "next-intl/server"

import Coupon from "./coupon"
import Price from "./price"
import { Video } from "@/types/public-videos-response"
import { RiyalIcon } from "@/components/icons"

type Props = {
  course: Video
}

const CourseDetails = async ({ course }: Props) => {
  const t = await getTranslations("payment")
  return (
    <div className="flex w-full flex-col justify-between gap-5">
      <Card
        key={course.id + "selected"}
        className="mx-auto w-full overflow-hidden rounded-[21px] border border-[#5A4A73] p-0! md:max-w-[390px]">
        <Card.Content className="relative w-full overflow-hidden p-1 rtl:text-right">
          <div className="relative overflow-hidden rounded-[20px]">
            <Card.Header className="relative z-10 flex-col items-start gap-3 rounded-2xl bg-[#272525E5] p-5">
              <h4 className="text-foreground text-xl font-bold">{course.title}</h4>
              <p className="text-foreground text-sm">{course.description}</p>

              <Chip className="rounded-sm bg-[#3C3C3C] px-2 py-1 backdrop-blur-xl">
                <Timer size={18} />
                {course.length}
              </Chip>
              <div></div>
            </Card.Header>
            <img
              className="absolute top-0 z-0 h-full w-full rounded-xl object-cover"
              src={course.logo}
              alt={course.title}
            />
          </div>
          <div className="flex items-center justify-between px-3 py-4">
            <span className="text-xs">{t("price.original")}</span>
            <span className="text-xl">
              {course.price} <RiyalIcon />
            </span>
          </div>
        </Card.Content>
      </Card>
      <Coupon {...course} />
      <Price {...course} />
    </div>
  )
}

export default CourseDetails
