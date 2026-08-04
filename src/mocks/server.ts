import { setupServer } from 'msw/node'
import { handlers } from './handlers'

/**
 * The Node-side interceptor used by the test suite. Started, reset and closed in
 * `vitest.setup.ts`; individual tests add per-case overrides with `server.use()`.
 */
export const server = setupServer(...handlers)
