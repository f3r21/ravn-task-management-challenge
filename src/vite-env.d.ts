/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * GraphQL endpoint.
   *
   * Both this and `VITE_API_TOKEN` are required together — with either missing the
   * app serves the MSW mock. A URL on its own reaches a real server that rejects
   * every query, which looks broken rather than unconfigured.
   */
  readonly VITE_API_URL?: string
  /** Bearer token issued for the challenge API. */
  readonly VITE_API_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
