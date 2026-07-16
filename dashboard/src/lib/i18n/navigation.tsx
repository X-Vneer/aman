import {
  NavigateFunction,
  NavigateProps,
  NavLinkProps,
  Link as ReactRouterLink,
  Navigate as ReactRouterNavigate,
  NavLink as ReactRouterNavLink,
  useParams as uesReactRouterParams,
  useLocation,
  useNavigate as useReactRouterNavigate,
  type LinkProps,
} from "react-router-dom"
import React, { RefAttributes } from "react"
import { LOCALES } from "../../config"
import { ForwardRefExoticComponent } from "react"

// wrappers for react-router-dom elements to add language prefix on navigation
export const useParams = () => {
  const params = uesReactRouterParams()
  const allowedLocales = LOCALES
  if (!params.locale || !allowedLocales.includes(params.locale as "ar" | "en")) {
    return { ...params, locale: "ar" }
  }
  return params
}
export const Link: ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>> = React.forwardRef(
  function Comp({ to, ...props }, ref) {
    const { locale } = useParams()
    return <ReactRouterLink ref={ref} to={`/${locale}${to}`} {...props} />
  },
)

export const NavLink: React.ForwardRefExoticComponent<NavLinkProps & React.RefAttributes<HTMLAnchorElement>> =
  React.forwardRef(function Comp({ to, ...props }, ref) {
    const { locale } = useParams()
    return <ReactRouterNavLink ref={ref} to={`/${locale}${to}`} {...props} />
  })
export const Navigate = ({ to, ...props }: NavigateProps) => {
  const { locale } = useParams()
  return <ReactRouterNavigate to={`/${locale}${to}`} {...props} />
}

export const useNavigate = (): NavigateFunction => {
  const { locale } = useParams()
  const navigate = useReactRouterNavigate()
  return (to) => {
    return navigate(`/${locale}${to}`)
  }
}

export const usePathname = () => {
  const location = useLocation()
  const { locale } = useParams()
  return location.pathname.replace(`/${locale}/`, "/")
}
