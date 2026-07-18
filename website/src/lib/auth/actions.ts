"use server"

import { cookies } from "next/headers"
import axios from "axios"

import { AmanApiGuest } from "@/services/aman"
import { ErrorResponse } from "@/types"
import { LoginResponse } from "@/types/login"
import { COOKIE_OPTIONS, SESSION_COOKIE, seal } from "./session"
import type { Session } from "./types"

type LoginResult = { ok: true; session: Session } | { ok: false; error: string }

/**
 * Native replacement for next-auth's Credentials authorize(): same wire
 * request (POST /guest/user/loginRegisterResendOtp with { mobile }), but
 * the session lands in our own encrypted aman_session cookie. Expected
 * failures come back as { ok: false } — never thrown — so the result
 * serializes cleanly across the server-action boundary.
 */
export async function loginAction({ mobile }: { mobile: string }): Promise<LoginResult> {
  try {
    const response = await AmanApiGuest.post<LoginResponse>("/user/loginRegisterResendOtp", { mobile })

    const responseUser = response.data.data.item
    const session: Session = {
      user: {
        id: responseUser.id,
        mobile: responseUser.mobile,
        first_name: responseUser.first_name,
        last_name: responseUser.last_name,
        full_name: responseUser.full_name,
        lang: responseUser.lang,
        email: responseUser.email,
        deleted_at: responseUser.deleted_at,
        token: response.data.data.token,
        timeout_audio: response.data.data.timeout_audio,
      },
    }

    ;(await cookies()).set(SESSION_COOKIE, await seal(session), COOKIE_OPTIONS)
    return { ok: true, session }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const responseError = error.response.data as ErrorResponse<{}>
      return { ok: false, error: responseError.message }
    }
    return { ok: false, error: "serverError" }
  }
}

export async function logoutAction() {
  ;(await cookies()).delete(SESSION_COOKIE)
}
