'use client'
import { RTL_LOCALES } from "@/config"
import { useParams } from "next/navigation"

export const useIsRTL = () => {
    const params = useParams() as { locale: string }
    const isRTl = RTL_LOCALES.includes(params.locale as 'ar')
    return isRTl
}