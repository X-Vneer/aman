import { background } from "@/assets"
import { cn } from "@/lib/cn"
import { StaticImageData } from "next/image"

type Props = {
  src?: StaticImageData | string
  className?: string
}

const BackgroundImage = ({ src, className }: Props) => {
  const resolved = src || background
  const url = typeof resolved === "string" ? resolved : resolved.src

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center">
      {src ? <div className="absolute inset-0 bg-[#030303D4]"></div> : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={cn(src ? "h-full w-full bg-center object-cover" : "object-contain", className)}
        src={url}
        alt="aman background"
        width={1000}
        height={1000}
      />
    </div>
  )
}

export default BackgroundImage
