import { createNavigation } from "next-intl/navigation"

import { routing } from "./routing"

const { Link, redirect: _redirect, usePathname, useRouter } = createNavigation(routing)

// Enable type narrowing after calling `redirect`
export const redirect: typeof _redirect = _redirect
export { Link, usePathname, useRouter }
