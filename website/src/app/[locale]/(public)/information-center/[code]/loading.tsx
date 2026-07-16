import { Spinner } from "@heroui/react"

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <div className="flex h-[80svh] w-full items-center justify-center">
            <Spinner />
        </div>
    )
}
