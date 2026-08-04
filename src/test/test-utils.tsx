import { QueryClient } from '@tanstack/react-query'
import { render, type RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { Providers } from '@/app/providers'
import { routes } from '@/app/routes'

/**
 * A query client for one test.
 *
 * Retries are off: a test that asserts an error state would otherwise wait
 * through two silent retries before the assertion could pass, and a flaky
 * handler would be papered over rather than reported.
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, refetchOnWindowFocus: false },
      mutations: { retry: false },
    },
  })
}

/**
 * Every test renders through one of these.
 *
 * The provider stack is written down in exactly one place, so adding one later
 * lands here rather than becoming a find-and-replace across the suite. Each call
 * builds a fresh `QueryClient`, so one test's fetched board cannot satisfy the
 * next test's query and hide a missing handler.
 */
export function renderWithProviders(ui: ReactNode, queryClient = createTestQueryClient()) {
  return render(<Providers queryClient={queryClient}>{ui}</Providers>)
}

/**
 * Mounts the real route table at a real URL, so navigation is exercised for what
 * it is rather than simulated by swapping components.
 *
 * The router is returned alongside the render result because a memory router
 * keeps its own history — it never touches `window.location`, so a test that
 * asserts on the address has to ask the router.
 */
export function renderApp(
  initialPath = '/',
  queryClient = createTestQueryClient(),
): RenderResult & { router: ReturnType<typeof createMemoryRouter> } {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })
  const result = render(
    <Providers queryClient={queryClient}>
      <RouterProvider router={router} />
    </Providers>,
  )
  return { ...result, router }
}

/**
 * `userEvent.setup()` must run before render, and returns the instance the test
 * then drives. Re-exported here so tests do not each import it separately.
 */
export { userEvent }
