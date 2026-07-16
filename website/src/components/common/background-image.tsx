import { background } from "@/assets"
import { cn } from "@/lib/cn"
import Image, { StaticImageData } from "next/image"

type Props = {
  src?: StaticImageData | string
  className?: string
}

const BackgroundImage = ({ src, className }: Props) => {
  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center">
      {src ? <div className="absolute inset-0 bg-[#030303D4]"></div> : null}
      <Image
        className={cn(src ? "h-full w-full bg-center object-cover" : "object-contain", className)}
        src={src || background}
        alt="aman background"
        width={1000}
        height={1000}
      />
    </div>
  )
}

export default BackgroundImage
