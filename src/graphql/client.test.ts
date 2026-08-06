import { graphql, http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TasksDocument } from '@/graphql/generated/graphql'
import { MOCK_API_URL } from '@/lib/env'
import { server } from '@/mocks/server'
import { ApiError, request } from './client'

describe('request', () => {
  it('returns the data for a successful query', async () => {
    const data = await request(TasksDocument, { input: {} })

    expect(data.tasks.length).toBeGreaterThan(0)
  })

  it('raises the GraphQL error message, not a generic failure', async () => {
    server.use(
      graphql.query('Tasks', () =>
        HttpResponse.json({ errors: [{ message: 'Something specific broke' }] }),
      ),
    )

    await expect(request(TasksDocument, { input: {} })).rejects.toThrow('Something specific broke')
  })

  it('flags an UNAUTHENTICATED error so callers can stop retrying', async () => {
    server.use(
      graphql.query('Tasks', () =>
        HttpResponse.json({
          errors: [{ message: 'Unauthorized', extensions: { code: 'UNAUTHENTICATED' } }],
        }),
      ),
    )

    // GraphQL reports auth failures with a 200 and an errors array, so the
    // status code alone would not have caught this.
    await expect(request(TasksDocument, { input: {} })).rejects.toMatchObject({
      isUnauthenticated: true,
    })
  })

  it('flags a 401 as unauthenticated even with no errors array', async () => {
    server.use(graphql.query('Tasks', () => new HttpResponse(null, { status: 401 })))

    await expect(request(TasksDocument, { input: {} })).rejects.toMatchObject({
      isUnauthenticated: true,
    })
  })

  it('reports a transport failure as an unreachable server', async () => {
    server.use(graphql.query('Tasks', () => HttpResponse.error()))

    await expect(request(TasksDocument, { input: {} })).rejects.toThrow(/could not reach/i)
  })

  it('rejects a non-error response that carries no data', async () => {
    // A malformed response would otherwise return `undefined` to a caller whose
    // types promise it a result.
    server.use(graphql.query('Tasks', () => HttpResponse.json({})))

    await expect(request(TasksDocument, { input: {} })).rejects.toThrow(/no data/i)
  })

  it('puts the operation on the wire as query text', async () => {
    // The generated documents are the operation's own text, so the client sends
    // it verbatim rather than printing an AST. Switching codegen back to
    // `documentNode` without restoring a `print()` call would post a serialised
    // AST object here and every request would fail identically — and the GraphQL
    // handlers would never see it, because MSW matches by *parsing* this field.
    // So it has to be read at the transport level to be asserted at all.
    let sentQuery: unknown
    server.use(
      http.post(MOCK_API_URL, async ({ request: sent }) => {
        sentQuery = ((await sent.json()) as { query: unknown }).query
        return HttpResponse.json({ data: { tasks: [] } })
      }),
    )

    await request(TasksDocument, { input: {} })

    expect(typeof sentQuery).toBe('string')
    expect(sentQuery).toContain('query Tasks($input: FilterTaskInput!)')
  })

  it('raises an ApiError, so callers can narrow on it', async () => {
    server.use(graphql.query('Tasks', () => HttpResponse.json({ errors: [{ message: 'nope' }] })))

    await expect(request(TasksDocument, { input: {} })).rejects.toBeInstanceOf(ApiError)
  })
})

describe('non-GraphQL failures', () => {
  it('reports a bare HTTP failure that carries no errors array', async () => {
    // A gateway or proxy failing in front of the API answers with a status and
    // no GraphQL body at all.
    server.use(graphql.query('Tasks', () => new HttpResponse(null, { status: 502 })))

    await expect(request(TasksDocument, { input: {} })).rejects.toThrow(/responded with 502/)
  })

  it('reports a response body that is not JSON', async () => {
    // Intercepted at the transport level rather than as a GraphQL operation,
    // because the whole point is a response that is not GraphQL at all — an
    // HTML error page from a proxy in front of the API.
    server.use(http.post(MOCK_API_URL, () => new HttpResponse('<html>gateway timeout</html>')))

    await expect(request(TasksDocument, { input: {} })).rejects.toThrow(/not valid JSON/)
  })
})

/**
 * What the client puts on the wire in each of the three modes from `lib/env`.
 *
 * Driven through a stubbed `fetch` rather than MSW, for one blunt reason: the
 * proxied URL is the relative path `/api/graphql`, and while a browser resolves
 * that against its own origin, Node's `fetch` under jsdom rejects it as
 * unparseable before any interceptor sees it. Stubbing the boundary is what lets
 * the deployed shape be asserted at all — and the request object is still the
 * real one `request()` built.
 */
describe('what reaches the network in each mode', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  async function send(env: Partial<ImportMetaEnv>, response = Response.json({ data: {} })) {
    vi.stubEnv('VITE_API_URL', env.VITE_API_URL ?? '')
    vi.stubEnv('VITE_API_TOKEN', env.VITE_API_TOKEN ?? '')
    // `lib/env` reads `import.meta.env` once at module scope, so the stubbed
    // values only reach it through a fresh module graph.
    vi.resetModules()

    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(response)
    vi.stubGlobal('fetch', fetchMock)

    const { request: freshRequest } = await import('./client')
    const result = freshRequest(TasksDocument, { input: {} })
    // Settled either way before the assertions, so a rejection is inspected
    // rather than escaping as an unhandled rejection.
    const error = await result.then(
      () => undefined,
      (reason: unknown) => reason,
    )

    const call = fetchMock.mock.calls[0]
    return { url: call[0], headers: new Headers(call[1]?.headers), error }
  }

  it('sends the token as a Bearer header when talking to the API directly', async () => {
    const { url, headers } = await send({
      VITE_API_URL: 'https://api.test/graphql',
      VITE_API_TOKEN: 'abc',
    })

    expect(url).toBe('https://api.test/graphql')
    expect(headers.get('authorization')).toBe('Bearer abc')
  })

  it('sends no Authorization header at all through the proxy', async () => {
    // No header, rather than an empty or `Bearer undefined` one. The credential
    // is the server's in this mode, and the browser was never given one to send.
    const { url, headers } = await send({ VITE_API_URL: '/api/graphql' })

    expect(url).toBe('/api/graphql')
    expect(headers.has('authorization')).toBe(false)
  })

  it('does not send a visitor of a deployed URL looking for a .env file', async () => {
    // The rejection message names whoever can act on it. On a deployed build
    // that is not the person reading it: they have no `.env`, and the token
    // that was rejected is the one in the host's environment.
    const { error } = await send(
      { VITE_API_URL: '/api/graphql' },
      new Response(null, { status: 401 }),
    )

    expect(error).toMatchObject({ isUnauthenticated: true })
    expect((error as Error).message).not.toMatch(/\.env/)
  })
})
