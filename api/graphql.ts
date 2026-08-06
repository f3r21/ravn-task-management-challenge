import {
  CreateTaskDocument,
  DeleteTaskDocument,
  ProfileDocument,
  TasksDocument,
  UpdateTaskDocument,
  UsersDocument,
  // `.js`, and it has to be spelled out. Vercel's Node builder transpiles this
  // file rather than bundling it, and `package.json` is `"type": "module"`, so
  // the specifier here is the one Node resolves at runtime — where an
  // extensionless relative import is `ERR_MODULE_NOT_FOUND` and the deployed
  // function fails to load at all. Nothing local catches it: Vite, Vitest and
  // `tsc` all resolve the extensionless form happily, and this one is `.js`
  // rather than `.ts` because it names the file Node will see, not the file
  // TypeScript reads.
} from '../src/graphql/generated/graphql.js'

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
 * **The endpoint answers six fixed operations and refuses everything else.**
 * There is still nothing to authenticate a caller against — the app has no
 * concept of a user — and checking `Origin` would stop nothing, since a header
 * is trivially set outside a browser. But the credential was never the only
 * thing worth protecting. Behind it is RAVN's shared backend, which the other
 * candidates are working against too, and a proxy that forwards whatever it is
 * handed lends RAVN's credential to a full introspection query, to a query
 * nobody wrote, and to as many of them per second as a script cares to send.
 * So this one does not forward what it is handed: it matches the request
 * against the documents the app itself sends and forwards its own copy of the
 * one that matched.
 *
 * What that deliberately does not do, so it is not mistaken for more than it
 * is. The variables stay the caller's, so `DeleteTask` with any id at all is
 * still expressible — the app can do that too, and an allowlist of operations
 * cannot say otherwise. Nothing here rate-limits; the platform's own limits are
 * the only ones. And no CORS headers are set anywhere in this file, so a
 * browser on another origin can send a request but cannot read the reply —
 * that is a consequence of never adding them rather than a control that was
 * chosen, and it does nothing whatsoever about `curl`.
 */

/** RAVN's endpoint, as issued in `Resources/Backend API.md`. */
export const UPSTREAM_URL = 'https://syn-api-production-e95c.up.railway.app/graphql'

/**
 * How long the proxy waits for RAVN's API before giving up on it.
 *
 * Two clocks run over an invocation and whichever expires first decides what
 * the visitor sees: `AbortSignal.timeout` produces the `504` below, in the
 * shape the app renders, while the platform killing the function produces its
 * own opaque error page. This value is what keeps the first one winning, and
 * the margin is far wider than the size of the number suggests — wide enough
 * that the older wording here, "short enough to fail before the platform kills
 * the function", read as a close-run thing it never was. Fluid compute is on
 * for this project and no `maxDuration` is set, in `vercel.json` or on the
 * project, so the platform's budget is its 300 s default, which is also Hobby's
 * maximum.
 *
 * Ten seconds is therefore not a race against the platform at all. It is a
 * judgement about how long a visitor should be asked to wait: long enough to
 * let a cold Railway dyno wake up, short enough that a stalled API becomes a
 * message on the board rather than a spinner nobody outlasts. Changing it
 * spends a visitor's patience, not the function's budget.
 */
const TIMEOUT_MS = 10_000

/**
 * The largest request body this endpoint will read.
 *
 * The biggest thing the app legitimately sends is one of the documents below —
 * under a kilobyte — plus a task's fields, so 16 KB is roomy and still refuses
 * a body sent to make the function spend memory and RAVN's bandwidth. Vercel
 * caps a request at 4.5 MB before this code runs, so this is a second, much
 * tighter bound rather than the only one.
 */
const MAX_BODY_BYTES = 16_384

/**
 * The only documents this proxy will forward, mapped from the text a caller
 * sends to the copy the proxy sends on.
 *
 * Keyed by the document rather than by an operation *name*, because a name only
 * says what the caller chose to call something: `query Tasks { __schema { … } }`
 * satisfies any check against `operationName` and is still a full introspection
 * query. Matching the document is what makes the answer "these six questions,
 * and nothing else".
 *
 * The key is that text with runs of whitespace collapsed, so a client that
 * indents or wraps differently still matches. Nothing else is normalised: a
 * comment, a comma, one extra field all change the key and are refused.
 * Whitespace is the only thing GraphQL ignores outside a string literal, and
 * none of these six contains one, so two texts sharing a key can only parse the
 * same way.
 *
 * The value is this file's own copy, and it is what goes upstream — the
 * caller's text is never forwarded, so what can reach RAVN is a set of six
 * constants rather than a claim about how carefully the checking was written.
 *
 * `String(document)` is the same call `src/graphql/client.ts` makes, on the same
 * documents, which is what keeps the two in step without a second list
 * maintained by hand. Codegen emits each document as a `String` subclass
 * carrying the phantom types, so this is the query text verbatim rather than a
 * re-print of an AST — which is what lets `graphql` be a devDependency instead
 * of shipping to production for one `print` call.
 */
/** The one difference between two spellings of a document that does not matter. */
function collapseWhitespace(query: string): string {
  return query.replace(/\s+/g, ' ').trim()
}

const ALLOWED_DOCUMENTS = new Map<string, string>(
  [
    TasksDocument,
    UsersDocument,
    ProfileDocument,
    CreateTaskDocument,
    UpdateTaskDocument,
    DeleteTaskDocument,
  ].map((document): [string, string] => {
    const text = String(document)
    return [collapseWhitespace(text), text]
  }),
)

/**
 * Statuses HTTP forbids a body on, so the `Response` constructor throws if asked
 * to pair one with a payload.
 *
 * The proxy always answers with a JSON `errors` body, so it can never *send*
 * these — but it echoes the upstream's status, and an upstream that returns one
 * of these (a `304` from a caching intermediary is the realistic case) would
 * otherwise make the constructor throw and turn "the upstream did something odd"
 * into "this function crashed".
 */
const NULL_BODY_STATUS = new Set([101, 103, 204, 205, 304])

/**
 * An error in the shape `client.ts` already knows how to read.
 *
 * GraphQL reports failures as an `errors` array, so answering in that shape
 * means the app's existing error path renders this — rather than the parse
 * failure a plain-text body would produce two layers away from the cause.
 *
 * A status that cannot carry a body is remapped to `502`, since the payload is
 * the whole point of this function; the intended status is left intact in the
 * message so the cause survives the remap.
 */
function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ errors: [{ message }] }), {
    status: NULL_BODY_STATUS.has(status) ? 502 : status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Named `POST` rather than exported as a default handler, and that is load-bearing
 * twice over.
 *
 * It selects the signature: Vercel reads a default export as Node's
 * `(req, res) => void`, ignores whatever it returns, and leaves the request
 * hanging until the platform times it out — which is exactly what the first
 * deploy of this file did, silently, with the answer only in the runtime log.
 * A named HTTP method is the Web `fetch`-style API, where returning a `Response`
 * is the contract.
 *
 * It is also the method restriction. Anything that is not a POST — a crawler
 * following the path, a reviewer opening it in a tab — is refused by the
 * platform before this code runs, so it costs nothing and spends none of RAVN's
 * rate limit. A branch here could only re-implement that less well.
 */
export async function POST(request: Request): Promise<Response> {
  const token = process.env.API_TOKEN?.trim()
  if (!token) {
    // A misconfigured deployment, not a bad request. Forwarding without the
    // token would surface RAVN's `UNAUTHENTICATED` to a visitor as though they
    // had done something wrong, which is the failure `readApiConfig` refuses to
    // produce locally for the same reason.
    return errorResponse('This deployment is missing its API credential.', 500)
  }

  // Checked before the body is touched, because it is the cheapest of these
  // refusals and the app never sends anything else. Parameters are stripped
  // rather than matched: `application/json; charset=utf-8` is the same media
  // type, and a `fetch` that spells it that way is not doing anything unusual.
  const mediaType = (request.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
  if (mediaType !== 'application/json') {
    return errorResponse('This endpoint accepts application/json.', 415)
  }

  // The declared length, refused before a byte is buffered. `Number(null)` is
  // `0` and an unparseable header is `NaN`, so a request that declares nothing
  // — a chunked upload — passes here and is caught by the check after the read
  // instead. Both exist because the header is a claim, not a measurement.
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    return errorResponse('The request body is larger than this endpoint accepts.', 413)
  }

  let raw: string
  try {
    raw = await request.text()
  } catch {
    // A caller that hangs up mid-upload. Reported as the bad request it is:
    // this read used to sit inside the `try` around `fetch`, where a failure
    // here was answered with "the API did not respond in time" — a message
    // about a request that had not been sent yet.
    return errorResponse('The request body could not be read.', 400)
  }

  // `length` counts UTF-16 code units where the cap is bytes, and UTF-8 spends
  // at least one byte per unit, so this can only under-count — it never refuses
  // a body that was within the cap.
  if (raw.length > MAX_BODY_BYTES) {
    return errorResponse('The request body is larger than this endpoint accepts.', 413)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return errorResponse('The request body was not valid JSON.', 400)
  }

  if (typeof parsed !== 'object' || parsed === null || !('query' in parsed)) {
    return errorResponse('The request body is not a GraphQL request.', 400)
  }
  if (typeof parsed.query !== 'string') {
    return errorResponse('The request body is not a GraphQL request.', 400)
  }

  const document = ALLOWED_DOCUMENTS.get(collapseWhitespace(parsed.query))
  if (!document) {
    // `400` rather than the more literal `403`: `client.ts` narrows 401 and 403
    // to "your access token was rejected" and stops retrying, so a `403` here
    // would tell the one visitor who could ever see it — a developer whose
    // documents have drifted from this list — to go and look at a credential
    // that is fine.
    return errorResponse('This endpoint does not serve that operation.', 400)
  }

  // Everything but the query and its variables is dropped. Each document above
  // defines exactly one operation, so an `operationName` alongside it can only
  // agree or break the request, and `extensions` is not something this app
  // sends.
  const variables = 'variables' in parsed ? parsed.variables : undefined

  let upstream: Response
  try {
    upstream = await fetch(UPSTREAM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      // Rebuilt rather than passed through. Forwarding the caller's own bytes
      // would mean trusting that this function and RAVN's parser read that JSON
      // identically — duplicate keys are the obvious way they might not — and
      // the document that was checked would not be provably the document that
      // runs.
      body: JSON.stringify({ query: document, variables }),
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

  // The body is read inside a guard, not as an argument to `new Response`.
  // `fetch` resolves when the headers arrive; the body streams afterward, and a
  // stall or reset mid-stream — or the timeout signal firing during the read —
  // rejects here. Outside a `try` that rejection escapes the function, and
  // Vercel answers with the opaque platform 500 that `TIMEOUT_MS` exists to
  // avoid. A gateway error carrying the same message keeps the failure in the
  // shape the app can render.
  let payload: string
  try {
    payload = await upstream.text()
  } catch {
    return errorResponse('The API response ended before it was complete.', 502)
  }

  // Verbatim on success, including a 200 carrying a GraphQL `errors` array:
  // those messages are the ones the UI shows, and rewriting them here would
  // replace every specific failure with the same generic one. The residual is
  // the mirror image of the non-2xx branch above — a GraphQL server that is not
  // hardened can put a resolver stack trace in that array and this forwards it.
  // Left as it is rather than filtered, because filtering would mean deciding
  // here which of the API's messages the UI is allowed to show, and the ones it
  // sends are validation text written for exactly that purpose.
  return new Response(payload, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
