import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './src/mocks/server'

/*
 * `onUnhandledRequest: 'error'` is the point of this setup, not a detail. Without
 * it a test whose handler is missing silently falls through to the real network:
 * it either hangs, or — worse — passes against live data. Failing loudly means a
 * missing handler is a test failure with a useful message.
 */
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  cleanup()
  // Handlers a test installed with `server.use()` are per-test overrides. Reset
  // so one test's stubbed failure cannot leak into the next test's happy path.
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
