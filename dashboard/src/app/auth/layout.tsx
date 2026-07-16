import { Navigate, usePathname } from "@/lib/i18n/navigation"
import { getSession } from "@/utils/get-session"
import { Outlet } from "react-router"
import { logo } from "../../assets"

export default function AuthLayout() {
  const whiteList = ["/auth/reset-password"]
  const pathname = usePathname()
  if (getSession()?.token && !whiteList.includes(pathname)) {
    return <Navigate to="/dashboard" replace />
  }
  return (
    <section className="flex h-full min-h-svh items-center justify-center p-8 md:p-10">
      <div className="flex w-full items-center gap-8 py-10 max-md:flex-col-reverse md:gap-32">
        <div className="w-full md:w-1/2">
          <div className="max-w-md max-md:mx-auto md:ms-auto">
            <Outlet />
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <img className="max-w-[330px] max-md:mx-auto max-md:w-32" src={logo} />
        </div>
      </div>
    </section>
  )
}
