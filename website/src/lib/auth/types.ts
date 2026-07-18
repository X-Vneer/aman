import type { User } from "@/types/login"

export type SessionUser = User & { token: string; timeout_audio: string }

export type Session = { user: SessionUser }
