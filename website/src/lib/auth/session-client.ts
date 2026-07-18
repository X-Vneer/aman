import { useEffect } from "react"
import { useStore } from "zustand"
import { createStore } from "zustand/vanilla"

import type { Session } from "./types"

// Client-side session store — the useSession() replacement. Deliberately
// NOT marked "use client": aman.ts (also in the server graph) dynamically
// imports it, so its exports must stay plain functions, not client
// references. Nothing here touches window/document at module scope, so
// evaluating it during SSR of client components is safe.

type SessionStatus = "loading" | "authenticated" | "unauthenticated"

type SessionState = { data: Session | null; status: SessionStatus }

const SYNC_KEY = "aman-session-sync"

const store = createStore<SessionState>(() => ({ data: null, status: "loading" }))

let hydrated = false
let hydratePromise: Promise<Session | null> | null = null
let listenersRegistered = false

/** Seed the store synchronously (login/logout) and ping other tabs. */
export function setClientSession(session: Session | null) {
  hydrated = true
  store.setState({ data: session, status: session ? "authenticated" : "unauthenticated" })
  try {
    localStorage.setItem(SYNC_KEY, String(session ? 1 : 0) + ":" + Math.random())
  } catch {
    // storage unavailable (private mode) — multi-tab sync degrades gracefully
  }
}

function revalidate() {
  hydrated = false
  hydratePromise = null
  void hydrate()
}

function registerListeners() {
  if (listenersRegistered || typeof window === "undefined") return
  listenersRegistered = true
  // Refresh when the tab regains focus, and when another tab logs in/out.
  const onFocus = () => {
    if (document.visibilityState === "visible") revalidate()
  }
  window.addEventListener("focus", onFocus)
  document.addEventListener("visibilitychange", onFocus)
  window.addEventListener("storage", (event) => {
    if (event.key === SYNC_KEY) revalidate()
  })
}

function hydrate(): Promise<Session | null> {
  if (!hydratePromise) {
    registerListeners()
    hydratePromise = fetch("/api/auth/session", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<Session | null>) : null))
      .then((session) => {
        setClientSession(session ?? null)
        return session ?? null
      })
      .catch(() => {
        // Fail soft like next-auth's getSession(): treat as logged out,
        // reset the dedupe slot so the next call retries.
        hydratePromise = null
        store.setState({ data: null, status: "unauthenticated" })
        return null
      })
  }
  return hydratePromise
}

/** Awaited by the aman.ts client branch — one deduped fetch per page load. */
export async function getClientSession(): Promise<Session | null> {
  if (hydrated) return store.getState().data
  return hydrate()
}

/** Drop-in for next-auth/react's useSession(): returns { data, status }. */
export function useSession() {
  const state = useStore(store)
  useEffect(() => {
    if (!hydrated) void hydrate()
  }, [])
  return { data: state.data, status: state.status }
}
