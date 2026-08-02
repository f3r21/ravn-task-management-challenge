import { RouterProvider, createBrowserRouter } from 'react-router'
import { ErrorBoundary } from '@/ui/error-boundary/error-boundary'
import { ErrorPage } from './error-page'
import { Providers } from './providers'
import { routes } from './routes'

const router = createBrowserRouter(routes)

/**
 * The boundary sits *above* the router rather than inside a layout route. A
 * layout route never remounts when a child navigates, which would let a caught
 * error persist across navigation; from up here, remounting is a page reload
 * away and nothing below can leave the app stuck on a fallback.
 */
export function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage onRetry={() => window.location.reload()} />}>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </ErrorBoundary>
  )
}
