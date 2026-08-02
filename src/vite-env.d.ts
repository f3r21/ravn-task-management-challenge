/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** GraphQL endpoint. When unset the app runs against the MSW mock. */
  readonly VITE_API_URL?: string
  /** Bearer token issued for the challenge API. */
  readonly VITE_API_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
