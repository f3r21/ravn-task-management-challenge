import { graphql, http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
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
