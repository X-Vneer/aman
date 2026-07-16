import { PermissionPaths } from "@/app/dashboard/permissions/type"
import usePermissions from "@/hooks/use-permissions"
import { useSmallScreen } from "@/hooks/use-small-screen"
import { downloadFile } from "@/utils/download-file"
import { Button, ButtonProps } from "@mantine/core"
import { useMutation } from "@tanstack/react-query"
import { useOptimisticSearchParams } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"

type Props = ButtonProps & {
  queryFun: (args: URLSearchParams) => Promise<unknown>
  filename: string
  permissionKey?: PermissionPaths
}

const ExportButton = ({ queryFun, permissionKey, ...props }: Props) => {
  const { t } = useTranslation()
  const searchParams = useOptimisticSearchParams()
  const { mutate, isPending } = useMutation({
    async mutationFn() {
      const funcSearchParams = new URLSearchParams(searchParams)
      funcSearchParams.set("export", "true")
      return await queryFun(funcSearchParams)
    },
    onSuccess(response) {
      downloadFile((response as { url: string }).url, `${props.filename}.csv`)
    },
  })
  const handleExport = () => {
    mutate()
  }

  const sm = useSmallScreen()

  const hasPermissionTo = usePermissions()
  if (permissionKey && !hasPermissionTo(permissionKey)) return null
  return (
    <Button
      variant="white"
      className="!border !border-gray-300"
      color="#5A5A5A"
      size="sm"
      leftSection={
        sm ? null : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="15" viewBox="0 0 18 15" fill="none">
            <path
              d="M9.00017 6.12506V11.7501M9.00017 11.7501L6.50017 9.25006M9.00017 11.7501L11.5002 9.25006M4.62517 14.2501C3.73303 14.251 2.86977 13.9339 2.19042 13.3556C1.51107 12.7774 1.06013 11.9758 0.918596 11.095C0.777059 10.2142 0.954193 9.3117 1.41819 8.54972C1.88218 7.78773 2.60264 7.21613 3.45017 6.93756C3.23242 5.82187 3.45747 4.66523 4.07766 3.71257C4.69785 2.75992 5.66448 2.08605 6.77285 1.83368C7.88122 1.58131 9.04431 1.77025 10.0158 2.36049C10.9873 2.95072 11.6909 3.89591 11.9777 4.99589C12.421 4.85171 12.8958 4.83436 13.3485 4.94581C13.8012 5.05726 14.2137 5.29306 14.5394 5.62659C14.8652 5.96012 15.0911 6.37808 15.1918 6.83328C15.2926 7.28847 15.264 7.76275 15.1093 8.20256C15.7915 8.46314 16.361 8.95431 16.719 9.59085C17.0769 10.2274 17.2008 10.9691 17.069 11.6874C16.9373 12.4058 16.5583 13.0553 15.9977 13.5234C15.4372 13.9914 14.7305 14.2485 14.0002 14.2501H4.62517Z"
              stroke="#444444"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      }
      onClick={handleExport}
      loading={isPending}
      {...props}>
      {sm ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="15" viewBox="0 0 18 15" fill="none">
          <path
            d="M9.00017 6.12506V11.7501M9.00017 11.7501L6.50017 9.25006M9.00017 11.7501L11.5002 9.25006M4.62517 14.2501C3.73303 14.251 2.86977 13.9339 2.19042 13.3556C1.51107 12.7774 1.06013 11.9758 0.918596 11.095C0.777059 10.2142 0.954193 9.3117 1.41819 8.54972C1.88218 7.78773 2.60264 7.21613 3.45017 6.93756C3.23242 5.82187 3.45747 4.66523 4.07766 3.71257C4.69785 2.75992 5.66448 2.08605 6.77285 1.83368C7.88122 1.58131 9.04431 1.77025 10.0158 2.36049C10.9873 2.95072 11.6909 3.89591 11.9777 4.99589C12.421 4.85171 12.8958 4.83436 13.3485 4.94581C13.8012 5.05726 14.2137 5.29306 14.5394 5.62659C14.8652 5.96012 15.0911 6.37808 15.1918 6.83328C15.2926 7.28847 15.264 7.76275 15.1093 8.20256C15.7915 8.46314 16.361 8.95431 16.719 9.59085C17.0769 10.2274 17.2008 10.9691 17.069 11.6874C16.9373 12.4058 16.5583 13.0553 15.9977 13.5234C15.4372 13.9914 14.7305 14.2485 14.0002 14.2501H4.62517Z"
            stroke="#444444"
            stroke-width="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        t("global.export")
      )}
    </Button>
  )
}

export default ExportButton
