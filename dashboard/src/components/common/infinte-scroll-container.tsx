import { useInViewport } from "@mantine/hooks"
import React, { useEffect } from "react"

type Props = {
  onBottomReached: () => void
  className?: string
  children: React.ReactNode
}

const InfiniteScrollContainer = ({ children, className, onBottomReached }: Props) => {
  const { ref, inViewport } = useInViewport()
  useEffect(() => {
    if (inViewport) onBottomReached()
  }, [inViewport])
  return (
    <div className={className}>
      {children}
      <div ref={ref} className="h-10"></div>
    </div>
  )
}

export default InfiniteScrollContainer
