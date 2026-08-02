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
 * Where requests are sent when no live API is configured.
 *
 * MSW intercepts at the network layer, so the client still performs a real
 * request against a real URL — this is the address it is aimed at. Keeping it a
 * URL rather than special-casing "no API configured" in the client means the
 * mocked and live paths run identical code.
 */
export const MOCK_API_URL = 'https://mock.local/graphql'

export const apiUrl = apiConfig?.url ?? MOCK_API_URL
