import { Navigate } from "@/lib/i18n/navigation"
import { isAuthenticated } from "@/utils/is-authenticated"

const ProtectedRoute = () => {
  if (false && !isAuthenticated()) {
    return <Navigate to="/auth/login" replace />
  }
  return null
}

export default ProtectedRoute
