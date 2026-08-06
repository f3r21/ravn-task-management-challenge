import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright's configuration, and the whole of it — this directory holds one
 * spec on purpose (see `deployed-proxy.spec.ts` for what it is for and why it
 * is not a suite).
 *
 * It lives beside the spec rather than at the repository root so that one
 * `tsconfig.json` in this directory covers both files. The root config
 * deliberately keeps `types` narrow for the browser, and typescript-eslint's
 * project service finds a config by walking up from the file it is linting —
 * the same reason `api/tsconfig.json` sits where it does.
 */

/**
 * Required, with no default, and localhost is not one.
 *
 * This spec exists to exercise `api/graphql.ts` on a real deployment. `npm run
 * dev` has no such function: with no credentials it answers from MSW inside the
 * browser, and the 26 Vitest files already cover that path far better than a
 * browser driver can. A config that quietly fell back to `localhost:5173` would
 * turn a check on the deployment into a slow, flaky duplicate of the unit
 * suite — passing while proving nothing about the thing it names.
 *
 * Pointing this at a local server is still useful for one thing: proving the
 * selectors below still match after a UI change, without waiting on a
 * deployment. It will fail at the last assertion in the spec, which is the one
 * that checks the proxy was reached at all — that is the assertion doing the
 * work, and it is meant to be unsatisfiable locally.
 */
const baseURL = process.env.E2E_BASE_URL?.trim()
if (!baseURL) {
  throw new Error(
    'E2E_BASE_URL is not set. Point it at a deployment (a Vercel preview URL), ' +
      'e.g. E2E_BASE_URL=https://<deployment>.vercel.app npm run test:e2e',
  )
}

export default defineConfig({
  testDir: '.',
  outputDir: './test-results',

  // The API behind the deployment is shared, live state and this spec writes to
  // it. One worker, so two tests can never be mid-mutation on the same board —
  // and a second spec added later inherits that rather than discovering it.
  fullyParallel: false,
  workers: 1,

  // No retries, in CI least of all. This spec's whole job is to notice that a
  // deployment is broken; a retry turns "the proxy is down" into a coin flip
  // that lands green about half the time, which is worse than not running it.
  // Flakiness here is a finding, not noise to be smoothed over.
  retries: 0,

  // Generous, because the first request of the run pays for a cold Railway dyno
  // upstream of the proxy — `api/graphql.ts` alone allows it ten seconds — and
  // this test makes four round trips through it. Long enough not to fail on a
  // slow morning, short enough that a hung deployment still reports.
  timeout: 90_000,
  expect: { timeout: 15_000 },

  // A `.only` left in a spec would silently narrow the run to nothing else.
  forbidOnly: !!process.env.CI,

  // `github` turns failures into annotations on the run; `list` is readable in a
  // terminal.
  reporter: process.env.CI ? 'github' : 'list',

  use: {
    baseURL,
    // Kept only for a failure, where it is the difference between "the deploy is
    // broken" and knowing which request broke it. On success it is dead weight.
    trace: 'retain-on-failure',
  },

  // One browser. The point of this spec is the server half; rendering the board
  // in three engines would triple the runtime to re-answer a question the unit
  // suite already answers in jsdom.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
