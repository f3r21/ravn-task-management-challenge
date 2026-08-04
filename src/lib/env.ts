/**
 * The app's one read of `import.meta.env`, validated at the boundary.
 *
 * Env vars are `string | undefined` no matter what the type declaration claims —
 * a typo in `.env`, a missing value in CI, a stale shell — so they are checked
 * here rather than trusted at each use. Everything downstream gets a value whose
 * shape has already been decided.
 */

export interface ApiConfig {
  url: string
  token: string
}

/**
 * The live API config, or `undefined` when the app should run against the mock.
 *
 * Both values are required together: a URL without a token reaches a real server
 * that answers every query with `UNAUTHENTICATED`, which is a worse failure than
 * not configuring the API at all — the app looks broken rather than unconfigured.
 * Whitespace-only values are treated as missing, because `VITE_API_TOKEN=` in a
 * half-filled `.env` is far more common than a deliberate empty token.
 */
export function readApiConfig(env: ImportMetaEnv): ApiConfig | undefined {
  const url = env.VITE_API_URL?.trim()
  const token = env.VITE_API_TOKEN?.trim()

  if (!url || !token) {
    return undefined
  }
  return { url, token }
}

export const apiConfig = readApiConfig(import.meta.env)

/** True when the app is serving mocked data rather than talking to the API. */
export const isUsingMockApi = apiConfig === undefined

/**
 * Whether the MSW worker has to be started before the first render.
 *
 * The same predicate as `isUsingMockApi`, exported under its own name so the
 * bootstrap has something to call rather than re-deciding "are we mocking" from
 * the raw env. It got that decision wrong: it gated on `VITE_API_URL` alone,
 * while everything else requires a url *and* a token. `.env.example` ships the
 * url filled in and the token blank, so `cp .env.example .env` — the first step
 * in the README — produced the one state neither branch handles: no worker
 * started, and `apiUrl` pointing at the mock host that only the worker answers.
 * Every request went to a name that does not resolve, under a banner saying the
 * app was running on mocked data.
 *
 * A function rather than a constant so a test can pass an env in; `main.tsx`
 * itself is excluded from coverage, which is why nothing caught this.
 */
export function shouldStartMockWorker(env: ImportMetaEnv): boolean {
  return readApiConfig(env) === undefined
}

/**
 * Where requests are sent when no live API is configured.
 *
 * MSW intercepts at the network layer, so the client still performs a real
 * request against a real URL — this is the address it is aimed at. Keeping it a
 * URL rather than special-casing "no API configured" in the client means the
 * mocked and live paths run identical code.
 */
export const MOCK_API_URL = 'https://mock.local/graphql'

export const apiUrl = apiConfig?.url ?? MOCK_API_URL
