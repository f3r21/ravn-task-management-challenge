/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * GraphQL endpoint. What it resolves to depends on its *shape*, and there are
   * three outcomes rather than two — see `readApiConfig` in `lib/env.ts`, which is
   * the only thing that reads either of these.
   *
   * An **absolute** URL needs `VITE_API_TOKEN` alongside it, and serves the MSW mock
   * without one: on its own it reaches a real server that rejects every query, which
   * looks broken rather than unconfigured.
   *
   * A **same-origin path** — `/api/graphql`, the deployed shape — needs no token and
   * does *not* fall back to the mock. The credential is the proxy's, server-side in
   * `api/graphql.ts`, and a token set here alongside one is deliberately dropped
   * rather than forwarded. This paragraph described the two-state version for a
   * while, and was therefore wrong about the mode production actually runs in.
   */
  readonly VITE_API_URL?: string
  /**
   * Bearer token issued for the challenge API. Required only by the absolute-URL
   * shape above; the deployment has none, by design.
   */
  readonly VITE_API_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
