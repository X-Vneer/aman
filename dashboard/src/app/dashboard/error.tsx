import { Button, Stack } from "@mantine/core"
import { QueryErrorResetBoundary } from "@tanstack/react-query"
import { ErrorBoundary } from "react-error-boundary"

const MyErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary
        onReset={reset}
        fallbackRender={({ resetErrorBoundary }) => (
          <Stack align="center" justify="center" gap="md" p="xl">
            There was an error!
            <Button onClick={() => resetErrorBoundary()}>Try again</Button>
          </Stack>
        )}>
        {children}
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
)

export default MyErrorBoundary
