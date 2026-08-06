import { type DocumentNode, Kind, type OperationDefinitionNode, print } from 'graphql'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as generated from '../src/graphql/generated/graphql'
import { POST, UPSTREAM_URL } from './graphql'

/**
 * The proxy is a plain `Request` → `Response` function, so it is tested as one:
 * no server, no Vercel runtime, just the handler and a stubbed `fetch` standing
 * in for RAVN's API. What matters here is what does and does not cross the two
 * boundaries — a credential going out, an upstream body coming back, and a
 * request that RAVN's shared API should never be asked to answer.
 */

/** An operation the app really sends, printed exactly as `client.ts` prints it. */
const ALLOWED_QUERY = print(generated.TasksDocument)

function post(
  body: unknown = { query: ALLOWED_QUERY, variables: { input: {} } },
  headers: Record<string, string> = {},
): Request {
  return new Request('https://deployed.test/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

function stubUpstream(response: Response) {
  const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** What was actually sent upstream, as the JSON body it was serialised from. */
function sentBody(fetchMock: ReturnType<typeof stubUpstream>): {
  query: string
  variables: unknown
} {
  const body = fetchMock.mock.calls[0][1]?.body
  if (typeof body !== 'string') {
    throw new Error('The proxy sent no serialised body upstream.')
  }
  return JSON.parse(body) as { query: string; variables: unknown }
}

/** Names a generated document by the one operation it defines. */
function operationName(document: DocumentNode): string | undefined {
  return document.definitions.find(
    (definition): definition is OperationDefinitionNode =>
      definition.kind === Kind.OPERATION_DEFINITION,
  )?.name?.value
}

beforeEach(() => {
  vi.stubEnv('API_TOKEN', 'server-side-token')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('the GraphQL proxy', () => {
  it('attaches the server-side token the browser was never given', async () => {
    const fetchMock = stubUpstream(json({ data: { tasks: [] } }))

    await POST(post())

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(UPSTREAM_URL)
    expect(new Headers(init?.headers).get('authorization')).toBe('Bearer server-side-token')
  })

  it('forwards the variables it was given, untouched', async () => {
    const fetchMock = stubUpstream(json({ data: { tasks: [] } }))
    const variables = { input: { name: 'design', status: 'IN_PROGRESS' } }

    await POST(post({ query: ALLOWED_QUERY, variables }))

    expect(sentBody(fetchMock).variables).toEqual(variables)
  })

  it('sends its own copy of the document rather than the caller’s text', async () => {
    // The allowlist is only worth as much as the guarantee that the document it
    // matched is the document that runs. Forwarding the caller's bytes would
    // leave that resting on this function and RAVN's parser reading the same
    // JSON the same way; forwarding the stored copy makes it structural.
    const fetchMock = stubUpstream(json({ data: { tasks: [] } }))
    const reindented = ALLOWED_QUERY.replace(/\s+/g, '\n\t')

    await POST(post({ query: reindented, variables: { input: {} } }))

    expect(sentBody(fetchMock).query).toBe(ALLOWED_QUERY)
  })

  it('gives up rather than hanging when the API does not answer', async () => {
    const fetchMock = stubUpstream(json({ data: {} }))

    await POST(post())

    // Asserted as "a signal was passed" rather than by advancing ten seconds of
    // fake time: the point is that the request cannot outlive the function, and
    // an unabortable fetch is the defect worth catching.
    expect(fetchMock.mock.calls[0][1]?.signal).toBeInstanceOf(AbortSignal)
  })

  it('answers a successful query with the API’s own body', async () => {
    // Verbatim on purpose: `client.ts` reads GraphQL error messages out of a
    // 200 response, so rewriting this body would replace every real error the
    // UI shows with a generic one.
    const upstream = { data: null, errors: [{ message: 'Task not found' }] }
    stubUpstream(json(upstream))

    const response = await POST(post())

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(upstream)
  })

  it('keeps an upstream failure’s status but not its body', async () => {
    // The status is what `client.ts` narrows on to stop retrying, so it has to
    // survive. The body does not: a gateway in front of the API answers with
    // HTML, and an API answering 500 can name internals a public URL should not.
    stubUpstream(new Response('<html>upstream stack trace</html>', { status: 502 }))

    const response = await POST(post())
    const body: unknown = await response.json()

    expect(response.status).toBe(502)
    expect(JSON.stringify(body)).not.toMatch(/stack trace/)
    expect(body).toMatchObject({ errors: [{ message: expect.stringContaining('502') as string }] })
  })

  it('passes a rejected credential through as 401, so the app stops retrying', async () => {
    stubUpstream(new Response('Unauthorized', { status: 401 }))

    expect((await POST(post())).status).toBe(401)
  })

  it('answers instead of crashing when the upstream body is cut off mid-stream', async () => {
    // `fetch` resolves once the headers arrive; the body is streamed after. A
    // cold dyno that flushes headers and then stalls, or a connection reset
    // mid-response, makes the body read reject *after* the status is known — and
    // if that read is not guarded, the whole function rejects and Vercel answers
    // with its own opaque 500, which is the platform error page the timeout was
    // written to avoid.
    stubUpstream(
      new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('{"data":'))
            controller.error(new Error('connection reset'))
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    const response = await POST(post())

    expect(response.status).toBe(502)
    expect(JSON.stringify(await response.json())).not.toMatch(/connection reset/)
  })

  it('does not crash on an upstream status that cannot carry a body', async () => {
    // `304 Not Modified` (like `204`) is a null-body status the `Response`
    // constructor refuses to pair with a body — so building the error envelope
    // for it throws, and an unguarded throw here becomes the same opaque 500.
    // The proxy sends no conditional headers, so this only arrives from a
    // misbehaving intermediary, but "the upstream did something odd" must not
    // read to the browser as "this function is broken".
    stubUpstream(new Response(null, { status: 304 }))

    const response = await POST(post())
    const body: unknown = await response.json()

    // Remapped to a status that can carry the message; the real upstream status
    // is preserved in the text so the cause is not lost.
    expect(response.status).toBe(502)
    expect(body).toMatchObject({ errors: [{ message: expect.stringContaining('304') as string }] })
  })

  it('reports an unreachable API as a gateway timeout', async () => {
    vi.stubGlobal('fetch', vi.fn<typeof fetch>().mockRejectedValue(new Error('ECONNREFUSED')))

    const response = await POST(post())

    expect(response.status).toBe(504)
    expect(JSON.stringify(await response.json())).not.toMatch(/ECONNREFUSED/)
  })

  it('fails loudly when the deployment has no token configured', async () => {
    // Rather than forwarding an unauthenticated request and surfacing RAVN's
    // `UNAUTHENTICATED` as if the visitor could do something about it.
    vi.stubEnv('API_TOKEN', '')
    const fetchMock = stubUpstream(json({ data: {} }))

    const response = await POST(post())

    expect(response.status).toBe(500)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('never echoes the token into a response', async () => {
    stubUpstream(new Response('Unauthorized', { status: 401 }))

    const response = await POST(post())

    expect(await response.text()).not.toMatch(/server-side-token/)
  })
})

/**
 * The half of this file that is about RAVN's API rather than about this app.
 *
 * The proxy holds a credential to a backend shared with other candidates, so
 * every one of these asserts the same thing twice: the caller is refused, and
 * — the part that actually matters — RAVN was never asked.
 */
describe('what the proxy refuses to forward', () => {
  it('refuses an operation the app never sends', async () => {
    const fetchMock = stubUpstream(json({ data: {} }))

    const response = await POST(post({ query: '{ __schema { types { name } } }' }))

    expect(response.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('refuses an operation wearing an allowed operation’s name', async () => {
    // The reason the allowlist is keyed by document and not by name: a name is
    // whatever the caller typed after `query`, and `operationName` is whatever
    // they put in the JSON. Neither says anything about what will be executed.
    const fetchMock = stubUpstream(json({ data: {} }))

    const response = await POST(
      post({ query: 'query Tasks { __schema { types { name } } }', operationName: 'Tasks' }),
    )

    expect(response.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('refuses an allowed document with one extra field selected', async () => {
    const fetchMock = stubUpstream(json({ data: {} }))

    const response = await POST(
      post({ query: ALLOWED_QUERY.replace('tasks(', '__typename tasks(') }),
    )

    expect(response.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('refuses a body that is not JSON', async () => {
    const fetchMock = stubUpstream(json({ data: {} }))

    const response = await POST(
      new Request('https://deployed.test/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'query Tasks { tasks { id } }',
      }),
    )

    expect(response.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('refuses a JSON body that carries no query', async () => {
    const fetchMock = stubUpstream(json({ data: {} }))

    expect((await POST(post({ variables: { input: {} } }))).status).toBe(400)
    expect((await POST(post({ query: { not: 'a string' } }))).status).toBe(400)
    expect((await POST(post([ALLOWED_QUERY]))).status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('refuses a content type it cannot parse', async () => {
    // A `fetch` with a string body and no explicit header sends `text/plain`,
    // so this is also the shape of a request from something that is not this
    // app at all.
    const fetchMock = stubUpstream(json({ data: {} }))

    const response = await POST(
      new Request('https://deployed.test/api/graphql', {
        method: 'POST',
        body: JSON.stringify({ query: ALLOWED_QUERY }),
      }),
    )

    expect(response.status).toBe(415)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('accepts the charset the media type is allowed to carry', async () => {
    const fetchMock = stubUpstream(json({ data: { tasks: [] } }))

    const response = await POST(
      post(undefined, { 'Content-Type': 'application/json; charset=utf-8' }),
    )

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalled()
  })

  it('refuses a body that declares a size over the cap, before reading it', async () => {
    // `Request` does not set `Content-Length` itself — the HTTP layer does, at
    // send time — so the header has to be set by hand to exercise the check
    // that runs before a byte is buffered.
    const fetchMock = stubUpstream(json({ data: {} }))

    const response = await POST(post(undefined, { 'Content-Length': '5000000' }))

    expect(response.status).toBe(413)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('refuses an oversized body that declared nothing at all', async () => {
    const fetchMock = stubUpstream(json({ data: {} }))

    const response = await POST(
      post({ query: ALLOWED_QUERY, variables: { input: { name: 'x'.repeat(20_000) } } }),
    )

    expect(response.status).toBe(413)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('what the proxy will forward', () => {
  /**
   * Every operation codegen emits, read off the generated module rather than
   * listed here, so an operation added to `src/graphql/operations/tasks.graphql`
   * arrives in this test whether or not anyone remembers to add it — and fails
   * until the proxy's allowlist has it too. The two fragment documents are
   * filtered out: the client never sends a fragment on its own.
   */
  const clientDocuments = Object.values(generated).filter((document: DocumentNode) =>
    document.definitions.some((definition) => definition.kind === Kind.OPERATION_DEFINITION),
  )

  it('finds every operation the brief lists, and no more', () => {
    // Not a restatement of the six tests below: it is what stops them passing
    // vacuously. A filter that matched nothing would generate no tests at all,
    // and an empty suite is green.
    expect(clientDocuments.map(operationName)).toEqual([
      'Tasks',
      'Users',
      'Profile',
      'CreateTask',
      'UpdateTask',
      'DeleteTask',
    ])
  })

  for (const document of clientDocuments) {
    it(`forwards ${operationName(document)}, which the app really sends`, async () => {
      const fetchMock = stubUpstream(json({ data: {} }))
      const query = print(document)

      const response = await POST(post({ query, variables: { input: {} } }))

      expect(response.status).toBe(200)
      expect(sentBody(fetchMock).query).toBe(query)
    })
  }
})
