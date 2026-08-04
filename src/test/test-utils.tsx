import { render, type RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { routes } from '@/app/routes'

/**
 * Every test renders through one of these.
 *
 * The point is that the provider stack is written down in exactly one place.
 * When a later phase adds one — the QueryClient, the toast region — it lands
 * here and nowhere else, instead of being a find-and-replace across the suite.
 */
function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>
}

export function renderWithProviders(ui: ReactNode): RenderResult {
  return render(<Providers>{ui}</Providers>)
}

/**
 * Mounts the real route table at a real URL, so navigation is exercised for what
 * it is rather than simulated by swapping components.
 */
export function renderApp(initialPath = '/'): RenderResult {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] })
  return render(
    <Providers>
      <RouterProvider router={router} />
    </Providers>,
  )
}

/**
 * `userEvent.setup()` must run before render, and returns the instance the test
 * then drives. Re-exported here so tests do not each import it separately.
 */
export { userEvent }
