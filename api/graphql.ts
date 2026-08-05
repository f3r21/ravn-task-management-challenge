/**
 * The GraphQL proxy that makes a deployed build possible at all.
 *
 * Vite replaces `import.meta.env.VITE_*` at build time, so a build carrying
 * `VITE_API_TOKEN` publishes RAVN's credential as a readable string in `dist/`
 * on a public URL — `grep -r "$API_TOKEN" dist/` finds it, and so does anyone
 * with devtools. There is no browser-side way around that: the token has to
 * reach RAVN's API, and everything the browser can read is public.
 *
 * So it never reaches the browser. This function runs on the deployment's
 * server, reads the token from the host's environment, and forwards the query.
 * The app posts to `/api/graphql` on its own origin carrying no credential at
 * all — see `readApiConfig`'s `proxied` mode in `src/lib/env.ts`.
 *
 * `API_TOKEN`, deliberately without a `VITE_` prefix: prefixing it is exactly
 * what would put it back in the bundle.
 *
 * **This endpoint is intentionally open, and that is a trade, not an oversight.**
 * The app has no concept of a user, so there is nothing to authenticate a caller
 * against; anyone who finds the URL can post a query through it. Checking
 * `Origin` would stop nothing that matters, since a header is trivially set
 * outside a browser. What the proxy does buy is that the credential itself stays
 * unreadable and can be rotated in one place — which is the difference between a
 * misused endpoint and a leaked token.
 */

/** RAVN's endpoint, as issued in `Resources/Backend API.md`. */
export const UPSTREAM_URL = 'https://syn-api-production-e95c.up.railway.app/graphql'

/**
 * Long enough for a cold Railway dyno, short enough to fail before the platform
 * kills the function and returns its own opaque error page instead of ours.
 */
const TIMEOUT_MS = 10_000

/**
 * An error in the shape `client.ts` already knows how to read.
 *
 * GraphQL reports failures as an `errors` array, so answering in that shape
 * means the app's existing error path renders this — rather than the parse
 * failure a plain-text body would produce two layers away from the cause.
 */
function errorResponse(
  message: string,
  status: number,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify({ errors: [{ message }] }), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    // Answered here rather than forwarded, so a crawler following the path does
    // not spend RAVN's rate limit on requests the app never makes.
    return errorResponse('This endpoint accepts POST requests only.', 405, { Allow: 'POST' })
  }

  const token = process.env.API_TOKEN?.trim()
  if (!token) {
    // A misconfigured deployment, not a bad request. Forwarding without the
    // token would surface RAVN's `UNAUTHENTICATED` to a visitor as though they
    // had done something wrong, which is the failure `readApiConfig` refuses to
    // produce locally for the same reason.
    return errorResponse('This deployment is missing its API credential.', 500)
  }

  let upstream: Response
  try {
    upstream = await fetch(UPSTREAM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      // Passed through untouched. The proxy has no opinion about the query; the
      // typed documents in `src/graphql/operations` are what decide that.
      body: await request.text(),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
  } catch {
    return errorResponse('The API did not respond in time.', 504)
  }

  if (!upstream.ok) {
    // The status survives — `client.ts` narrows on 401/403 to stop retrying a
    // credential that will not start working. The body does not: a gateway in
    // front of the API answers with an HTML page, and a 500 from the API itself
    // can name internals that have no business on a public URL.
    return errorResponse(`The API responded with ${String(upstream.status)}.`, upstream.status)
  }

  // Verbatim on success, including a 200 carrying a GraphQL `errors` array:
  // those messages are the ones the UI shows, and rewriting them here would
  // replace every specific failure with the same generic one.
  return new Response(await upstream.text(), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
