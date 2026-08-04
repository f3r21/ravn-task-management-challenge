import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { ToastProvider } from '@/ui/toast/toast-context'
import { createQueryClient } from './query-client'

interface ProvidersProps {
  children: ReactNode
  /** Supplied by tests so each one starts with an empty cache. */
  queryClient?: QueryClient
}

/**
 * Every context the app needs, in one place.
 *
 * `useState` with an initialiser rather than a module constant: the client is
 * created once per mount and never recreated by a re-render, which a bare
 * `createQueryClient()` in the body would do on every render — throwing away the
 * cache each time.
 */
export function Providers({ children, queryClient }: ProvidersProps) {
  const [client] = useState(() => queryClient ?? createQueryClient())

  return (
    <QueryClientProvider client={client}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  )
}
