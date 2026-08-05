import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { POST, UPSTREAM_URL } from './graphql'

/**
 * The proxy is a plain `Request` → `Response` function, so it is tested as one:
 * no server, no Vercel runtime, just the handler and a stubbed `fetch` standing
 * in for RAVN's API. What matters here is what does and does not cross the two
 * boundaries — a credential going out, and an upstream body coming back.
 */

function post(body: unknown = { query: '{ tasks { id } }' }): Request {
  return new Request('https://deployed.test/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

  it('forwards the query body unchanged', async () => {
    const fetchMock = stubUpstream(json({ data: { tasks: [] } }))
    const body = { query: 'query Tasks($input: FilterTaskInput!) { tasks(input: $input) { id } }' }

    await POST(post(body))

    expect(fetchMock.mock.calls[0][1]?.body).toBe(JSON.stringify(body))
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
