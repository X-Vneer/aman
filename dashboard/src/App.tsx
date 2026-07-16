import { DirectionProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
import { useTranslation } from "react-i18next"
import Router from "./router"
import { useEffect } from "react"

const queryClient = new QueryClient()
function App() {
  const { i18n } = useTranslation()
  const dir = i18n.dir()
  useEffect(() => {
    document.documentElement.dir = dir
  }, [dir])

  return (
    <DirectionProvider initialDirection={dir} detectDirection>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <Router />
        </NuqsAdapter>

        <ReactQueryDevtools />
      </QueryClientProvider>
    </DirectionProvider>
  )
}

export default App
