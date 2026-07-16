"use client"

import AutoScroll from "embla-carousel-auto-scroll"
import useEmblaCarousel from "embla-carousel-react"
import StoryCard from "./story-card"
import { Story } from "../types"

const StoriesSlider = ({ stories }: { stories: Story[] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: "y", loop: true, dragFree: true }, [
    AutoScroll({ speed: 0.5, playOnInit: true, stopOnMouseEnter: true, stopOnInteraction: false }),
  ])

  return (
    <section className="embla relative h-[400px]">
      <div
        style={{
          background: "linear-gradient(180deg, #1A1919 0%, rgba(26, 25, 25, 0) 100%);",
        }}
        className="absolute left-0 top-0 z-10 h-10 w-full"
      />
      <div
        style={{
          background: "linear-gradient(0deg, #1A1919 0%, rgba(26, 25, 25, 0) 100%);",
        }}
        className="absolute bottom-0 right-0 z-[1] h-10 w-full"
      />
      <div className="embla__viewport relative overflow-hidden" ref={emblaRef}>
        <div className="embla__container relative h-[400px] flex-col">
          {stories.map((story) => (
            <div className="embla__slide basis-3/4 pb-4" key={story.id}>
              <StoryCard {...story} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StoriesSlider
