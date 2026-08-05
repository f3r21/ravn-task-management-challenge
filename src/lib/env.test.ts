import { afterEach, describe, expect, it, vi } from 'vitest'
import { type ApiConfig, readApiConfig, shouldStartMockWorker } from './env'

function env(overrides: Partial<ImportMetaEnv>): ImportMetaEnv {
  return overrides as ImportMetaEnv
}

/**
 * Every env shape the app can start in, read by both predicates below.
 *
 * One table rather than two sets of examples, because `readApiConfig` and
 * `shouldStartMockWorker` answering differently for the same env is a defect
 * this project has already shipped once — the bootstrap gated on the URL alone
 * while everything else required a URL *and* a token, and nothing caught it
 * because `main.tsx` is excluded from coverage. Deriving both expectations from
 * one row is what makes that disagreement impossible to write.
 */
const cases: { name: string; env: Partial<ImportMetaEnv>; expected: ApiConfig | undefined }[] = [
  {
    name: 'a URL and a token talk to the API directly',
    env: { VITE_API_URL: 'https://api.test/graphql', VITE_API_TOKEN: 'abc' },
    expected: { mode: 'direct', url: 'https://api.test/graphql', token: 'abc' },
  },
  {
    name: 'surrounding whitespace copied in from an email is trimmed',
    env: { VITE_API_URL: ' https://api.test/graphql ', VITE_API_TOKEN: ' abc ' },
    expected: { mode: 'direct', url: 'https://api.test/graphql', token: 'abc' },
  },
  {
    name: 'nothing configured falls back to the mock',
    env: {},
    expected: undefined,
  },
  {
    // A URL without a token reaches a real server that rejects every query, so
    // the app would look broken rather than unconfigured.
    name: 'an absolute URL with no token falls back to the mock',
    env: { VITE_API_URL: 'https://api.test/graphql' },
    expected: undefined,
  },
  {
    name: 'a blank token is missing, since a half-filled .env is the common case',
    env: { VITE_API_URL: 'https://api.test/graphql', VITE_API_TOKEN: '   ' },
    expected: undefined,
  },
  {
    // The deployed shape. The rule above exists because an absolute URL reaches
    // RAVN's server, which answers `UNAUTHENTICATED` to an unauthenticated
    // request; a same-origin path structurally cannot do that, because it
    // reaches this app's own origin — which is where the credential lives.
    name: 'a same-origin path is proxied and needs no token',
    env: { VITE_API_URL: '/api/graphql' },
    expected: { mode: 'proxied', url: '/api/graphql' },
  },
  {
    // The proxy adds its own `Authorization` header, so a token supplied here
    // could only be a stray value — and forwarding it would send a credential
    // to an origin that never asked for one.
    name: 'a token alongside a same-origin path is ignored, not sent',
    env: { VITE_API_URL: '/api/graphql', VITE_API_TOKEN: 'abc' },
    expected: { mode: 'proxied', url: '/api/graphql' },
  },
  {
    // `//host/path` is protocol-relative: it starts with a slash but resolves to
    // a *different* origin, so it carries none of the guarantee the rule above
    // rests on. Without this case, `VITE_API_URL=//attacker.test/graphql` would
    // read as "proxied" and the app would talk to it with no token and no
    // proxy in front of it.
    name: 'a protocol-relative URL is not same-origin, so it falls back to the mock',
    env: { VITE_API_URL: '//other.test/graphql' },
    expected: undefined,
  },
  {
    // Relative to whatever path the router happens to be on, which is not a
    // stable endpoint. Only a root-absolute path is unambiguous.
    name: 'a path-relative URL is too ambiguous to proxy, so it falls back to the mock',
    env: { VITE_API_URL: 'api/graphql' },
    expected: undefined,
  },
]

describe('readApiConfig', () => {
  it.each(cases)('$name', ({ env: raw, expected }) => {
    expect(readApiConfig(env(raw))).toEqual(expected)
  })
})

describe('shouldStartMockWorker', () => {
  it.each(cases)('$name', ({ env: raw, expected }) => {
    expect(shouldStartMockWorker(env(raw))).toBe(expected === undefined)
  })
})

/**
 * The constants the app actually reads, re-evaluated against a stubbed env.
 *
 * `isUsingMockApi` is what `BoardPage` renders its "running on mocked data"
 * banner from, and it is a module-level constant — so proving the banner stays
 * off on a proxied deploy means re-importing the module, not calling a function.
 */
describe('the constants derived from import.meta.env', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  async function reimport(overrides: Partial<ImportMetaEnv>) {
    vi.stubEnv('VITE_API_URL', overrides.VITE_API_URL ?? '')
    vi.stubEnv('VITE_API_TOKEN', overrides.VITE_API_TOKEN ?? '')
    vi.resetModules()
    return import('./env')
  }

  it('aims at the mock host and shows the banner when nothing is configured', async () => {
    const { apiConfig, apiUrl, isUsingMockApi, MOCK_API_URL } = await reimport({})

    expect(apiConfig).toBeUndefined()
    expect(isUsingMockApi).toBe(true)
    expect(apiUrl).toBe(MOCK_API_URL)
  })

  it('leaves the banner off and posts to the proxy on a proxied deploy', async () => {
    const { apiConfig, apiUrl, isUsingMockApi } = await reimport({ VITE_API_URL: '/api/graphql' })

    expect(isUsingMockApi).toBe(false)
    expect(apiUrl).toBe('/api/graphql')
    expect(apiConfig).toEqual({ mode: 'proxied', url: '/api/graphql' })
  })

  it('leaves the banner off and posts to the API when credentials are configured', async () => {
    const { apiUrl, isUsingMockApi } = await reimport({
      VITE_API_URL: 'https://api.test/graphql',
      VITE_API_TOKEN: 'abc',
    })

    expect(isUsingMockApi).toBe(false)
    expect(apiUrl).toBe('https://api.test/graphql')
  })
})
