"use server"
import { signOut } from "@/lib/auth/auth"

export const unathorizationDetection = async () => {
  const response = await signOut({ redirectTo: "/" })
  return response
}
