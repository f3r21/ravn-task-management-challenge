import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/graphql/client'

/**
 * Builds the query client.
 *
 * A factory rather than a module-level singleton: every test gets a client whose
 * cache starts empty, so one test's fetched board cannot satisfy the next test's
 * query and hide a missing handler. The app creates exactly one at startup.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // A rejected token will be rejected again on the retry, so retrying only
        // delays the error message the user needs to see by several seconds.
        retry: (failureCount, error) => {
          if (error instanceof ApiError && error.isUnauthenticated) {
            return false
          }
          return failureCount < 2
        },
        staleTime: 30_000,
        // The board is shared, so someone else's change should show up without a
        // reload; refetching when the tab regains focus is the cheapest way to
        // get that without polling.
        refetchOnWindowFocus: true,
      },
      mutations: {
        // A mutation that failed may well have applied server-side. Retrying it
        // risks creating the same task twice.
        retry: false,
      },
    },
  })
}
