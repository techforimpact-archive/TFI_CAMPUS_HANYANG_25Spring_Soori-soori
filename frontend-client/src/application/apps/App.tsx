import { ThemeProvider } from '@emotion/react'
import { RouterProvider } from 'react-router'

import { EventModel } from '@/domain/models/models'
import { EventCreateUseCase } from '@/domain/use_cases/use_cases'
import { ProgressIndicator } from '@/presentation/components/components'
import { useLoading } from '@/presentation/hooks/hooks'
import { SOORITheme, GlobalStyle } from '@/theme/theme'

import { QueryProvider } from '../configurations/configurations'
import { FirebaseProvider, LoadingProvider } from '../contexts/contexts'
import { router } from '../routers/routers'

const eventCreateUseCase = new EventCreateUseCase()

window.addEventListener('error', (event: ErrorEvent) => {
  const message = event.message
  const filename = event.filename
  const line = event.lineno
  const col = event.colno
  const stack = event.error instanceof Error ? (event.error.stack ?? '') : ''
  const errorEvent = new EventModel({
    title: message,
    description: `File: ${filename}:${line.toString()}:${col.toString()}\n\n${stack}`,
    fatal: true,
  })
  void eventCreateUseCase.call(errorEvent)
})

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  const reason = event.reason as unknown
  const stack = reason instanceof Error ? (reason.stack ?? '') : String(reason)
  const rejectionEvent = new EventModel({
    title: 'Unhandled Rejection',
    description: stack,
    fatal: true,
  })
  void eventCreateUseCase.call(rejectionEvent)
})

export function App() {
  return (
    <ThemeProvider theme={SOORITheme}>
      <GlobalStyle />
      <FirebaseProvider>
        <LoadingProvider>
          <QueryProvider>
            <AppContent />
          </QueryProvider>
        </LoadingProvider>
      </FirebaseProvider>
    </ThemeProvider>
  )
}

export function AppContent() {
  const { loading } = useLoading()

  return (
    <>
      <RouterProvider router={router} />
      {loading && <ProgressIndicator />}
    </>
  )
}
