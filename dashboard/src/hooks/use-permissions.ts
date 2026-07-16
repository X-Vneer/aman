import { User } from "@/@types/user"
import { PermissionPaths } from "@/app/dashboard/permissions/type"
import { LOCALSTORAGE_SESSION_KEY } from "@/config"
import { useLocalStorage } from "@mantine/hooks"

const usePermissions = () => {
  const [user, setValue] = useLocalStorage<User | null>({
    key: LOCALSTORAGE_SESSION_KEY,
    defaultValue: null,
  })

  const hasPermissionsTo = (action: PermissionPaths | "Permissions") => {
    if (!user || !user.item?.permissions) return false
    if (user && user.item.role_name === "Admin" && action === "Permissions") return true
    if (action.includes(":")) {
      return user.item.permissions.includes(action)
    }
    return user.item.permissions.toString().includes(action)
  }

  return hasPermissionsTo
}

export default usePermissions
