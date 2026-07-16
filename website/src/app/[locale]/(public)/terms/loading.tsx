import { Spinner } from "@heroui/react"

export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner size="xl" />
    </div>
  )
}
