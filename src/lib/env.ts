/**
 * The app's one read of `import.meta.env`, validated at the boundary.
 *
 * Env vars are `string | undefined` no matter what the type declaration claims —
 * a typo in `.env`, a missing value in CI, a stale shell — so they are checked
 * here rather than trusted at each use. Everything downstream gets a value whose
 * shape has already been decided.
 */

/**
 * How the app reaches the API, when it reaches one at all.
 *
 * A discriminated union rather than an optional `token`, so the credential only
 * exists on the member that has one. `client.ts` cannot reach for a token in
 * proxied mode and send `Bearer undefined` — that is a compile error here
 * rather than a header nobody notices in production.
 */
export type ApiConfig =
  { mode: 'direct'; url: string; token: string } | { mode: 'proxied'; url: string }

/**
 * A host no real deployment can be served from, used only to resolve against.
 *
 * `.invalid` is reserved by RFC 2606 precisely so it can never be registered,
 * so a URL that resolves to this origin can only have done so by being relative
 * — which is the question `isSameOriginPath` is asking.
 */
const RESOLUTION_BASE = 'https://same-origin.invalid'

/**
 * Whether a configured URL points at this app's own origin.
 *
 * Asked of a URL parser rather than of the string, because the string is not
 * what a browser will act on. `//host/path` is the obvious protocol-relative
 * spelling, but it is not the only one: a backslash is normalised to a forward
 * slash in the authority position, and tab, line feed and carriage return are
 * stripped outright before parsing. So `/\host`, `/<tab>/host`, `/<lf>/host`
 * and `/<cr>/host` all resolve off-origin while reading, character by
 * character, as ordinary rooted paths.
 *
 * This check originally rejected `//` alone and accepted the other four. That
 * was not reachable by an attacker — `VITE_API_URL` is build configuration, not
 * anything a visitor supplies — but it is the wrong shape of answer: resolving
 * the URL answers "is this our origin" for every spelling at once, including
 * the ones nobody has thought of yet.
 *
 * The leading-slash requirement stays. Resolution alone would accept an
 * absolute URL that happens to name the base host, and a path-relative
 * `api/graphql` resolves against whatever route the router is on rather than a
 * fixed endpoint.
 */
function isSameOriginPath(url: string): boolean {
  if (!url.startsWith('/')) {
    return false
  }
  try {
    return new URL(url, RESOLUTION_BASE).origin === RESOLUTION_BASE
  } catch {
    // A string `URL` cannot parse at all is not a path this app should post to.
    return false
  }
}

/**
 * The live API config, or `undefined` when the app should run against the mock.
 *
 * Three states, not two:
 *
 * - **mock** — nothing usable configured. MSW serves seeded data.
 * - **direct** — an absolute URL *and* a token: local development with a
 *   filled-in `.env`.
 * - **proxied** — a same-origin path: the deployed shape. No token, because the
 *   browser must not be given one. Vite replaces `import.meta.env` at build
 *   time, so any `VITE_`-prefixed value readable here is also readable in
 *   `dist/` — see `api/graphql.ts`, which holds the real one server-side.
 *
 * A token is required alongside an *absolute* URL because that URL reaches a
 * real server which answers every query `UNAUTHENTICATED`, a worse failure than
 * not configuring the API at all: the app looks broken rather than unconfigured.
 * A same-origin path cannot fail that way — it reaches this app's own origin,
 * where the proxy attaches the credential. So that rule is unchanged rather than
 * relaxed; it never applied to this shape.
 *
 * Whitespace-only values are treated as missing, because `VITE_API_TOKEN=` in a
 * half-filled `.env` is far more common than a deliberate empty token.
 */
export function readApiConfig(env: ImportMetaEnv): ApiConfig | undefined {
  const url = env.VITE_API_URL?.trim()
  const token = env.VITE_API_TOKEN?.trim()

  if (!url) {
    return undefined
  }
  if (isSameOriginPath(url)) {
    // A token set alongside a proxied URL is dropped rather than forwarded: the
    // proxy attaches its own, so this one could only be a stray value, and
    // sending it would hand a credential to an origin that never asked for one.
    return { mode: 'proxied', url }
  }
  if (!token) {
    return undefined
  }
  return { mode: 'direct', url, token }
}

export const apiConfig = readApiConfig(import.meta.env)

/**
 * True when the app is serving mocked data rather than talking to the API.
 *
 * What `BoardPage`'s "running on mocked data" banner renders from. Defined as
 * the absence of a config rather than as its own reading of the env, so a
 * proxied deploy — which has a config but no token — cannot end up announcing
 * mocked data while showing live tasks.
 */
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
