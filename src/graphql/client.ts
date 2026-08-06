import { apiConfig, apiUrl } from '@/lib/env'
import type { TypedDocumentString } from './generated/graphql'

/**
 * The app's GraphQL transport.
 *
 * Hand-written over `fetch` rather than pulled from a client library, for two
 * reasons. React Query already owns caching, deduplication and invalidation, so
 * a client with its own normalised cache would put two sources of truth under
 * the same task and two places to look when the board disagrees with itself.
 * And the whole surface needed here is one function — a library's value would be
 * the cache this app does not want.
 *
 * The URL is always a real URL: when no token is configured it points at the
 * mock host MSW intercepts. That keeps one code path, so the request exercised
 * in tests is the request that runs in production.
 */

/**
 * Written for whoever can act on it, which is not the same person in both modes.
 *
 * In `direct` mode that is a developer with a `.env` to fix. On a proxied
 * deploy the token lives in the host's environment and the visitor has no
 * `.env` at all, so naming one would send them looking for a file that does not
 * exist on their machine.
 */
const AUTH_MESSAGE =
  apiConfig?.mode === 'proxied'
    ? 'The server rejected this app’s access token.'
    : 'Your access token was rejected. Check VITE_API_TOKEN in your .env file.'

/**
 * A failure worth showing a user, separated from one worth retrying.
 *
 * GraphQL answers `200 OK` with an `errors` array, so "did this work" is not a
 * status code. This collapses both shapes — transport failure and GraphQL error
 * — into one thing the UI can render, and marks the one case where retrying is
 * pointless because the credential itself is wrong.
 */
export class ApiError extends Error {
  readonly isUnauthenticated: boolean

  constructor(message: string, isUnauthenticated = false) {
    super(message)
    this.name = 'ApiError'
    this.isUnauthenticated = isUnauthenticated
  }
}

interface GraphQLResponseBody<Result> {
  data?: Result | null
  errors?: { message: string; extensions?: { code?: string } }[]
}

/**
 * Runs a generated document and returns its typed result.
 *
 * Taking a `TypedDocumentString` is what ties variables and result together:
 * passing the wrong variables for a document, or reading a field the document
 * did not select, is a compile error rather than a runtime `undefined`. The
 * phantom type parameters are the whole reason to take the generated wrapper
 * rather than a plain `string` — a `string` would type-check against anything.
 */
export async function request<Result, Variables extends object>(
  document: TypedDocumentString<Result, Variables>,
  variables: Variables,
): Promise<Result> {
  let response: Response
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // `direct` only. In proxied mode the credential is the server's, not
        // the browser's — and narrowing on the mode rather than on the config's
        // presence is what makes reaching for a token that isn't there a
        // compile error instead of a `Bearer undefined` header.
        ...(apiConfig?.mode === 'direct' ? { Authorization: `Bearer ${apiConfig.token}` } : {}),
      },
      // The document is already the query text — no `print()`, and so no
      // `graphql` in the bundle. `String(…)` because codegen emits a `String`
      // subclass carrying the phantom types: `JSON.stringify` would unwrap it
      // anyway, but relying on that leaves the body's shape depending on a
      // detail of a wrapper object nobody expects to be one.
      body: JSON.stringify({ query: String(document), variables }),
    })
  } catch {
    // Offline, DNS failure, CORS — anything that never reached a resolver.
    throw new ApiError('Could not reach the server. Check your connection.')
  }

  if (response.status === 401 || response.status === 403) {
    throw new ApiError(AUTH_MESSAGE, true)
  }

  let body: GraphQLResponseBody<Result>
  try {
    // JSON is untyped by nature, so this assertion cannot be avoided — only
    // placed well. It sits at the transport boundary so nothing downstream has to
    // repeat it: every caller gets a typed result from a `TypedDocumentNode`.
    body = (await response.json()) as GraphQLResponseBody<Result>
  } catch {
    // A failing gateway answers with an HTML page or an empty body, so the parse
    // is the *symptom*. The status code is the diagnosis, and it is the more
    // useful thing to report when there is one.
    throw new ApiError(
      response.ok
        ? 'The server returned a response that was not valid JSON.'
        : `The server responded with ${String(response.status)}.`,
    )
  }

  // Checked before `response.ok`, because a GraphQL error carries a message
  // worth showing and the status code alone does not.
  const firstError = body.errors?.[0]
  if (firstError) {
    const isUnauthenticated = firstError.extensions?.code === 'UNAUTHENTICATED'
    throw new ApiError(isUnauthenticated ? AUTH_MESSAGE : firstError.message, isUnauthenticated)
  }

  if (!response.ok) {
    throw new ApiError(`The server responded with ${String(response.status)}.`)
  }

  if (body.data == null) {
    throw new ApiError('The server returned no data.')
  }

  return body.data
}
