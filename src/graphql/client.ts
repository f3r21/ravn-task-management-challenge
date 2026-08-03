import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { print } from 'graphql'
import { apiConfig, apiUrl } from '@/lib/env'

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

const AUTH_MESSAGE = 'Your access token was rejected. Check VITE_API_TOKEN in your .env file.'

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
 * Taking a `TypedDocumentNode` is what ties variables and result together:
 * passing the wrong variables for a document, or reading a field the document
 * did not select, is a compile error rather than a runtime `undefined`.
 */
export async function request<Result, Variables extends object>(
  document: TypedDocumentNode<Result, Variables>,
  variables: Variables,
): Promise<Result> {
  let response: Response
  try {
    response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiConfig ? { Authorization: `Bearer ${apiConfig.token}` } : {}),
      },
      body: JSON.stringify({ query: print(document), variables }),
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
