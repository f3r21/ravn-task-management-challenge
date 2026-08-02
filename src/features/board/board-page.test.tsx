import { screen, waitForElementToBeRemoved, within } from '@testing-library/react'
import { graphql, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/mocks/server'
import { taskStore } from '@/mocks/task-store'
import { renderApp, userEvent } from '@/test/test-utils'

/**
 * Waits for the first query to settle.
 *
 * Keyed on the status region's text, not on the skeleton: the skeleton is
 * `aria-hidden` and cannot be found this way at all.
 */
async function waitForBoard() {
  await waitForElementToBeRemoved(() => screen.queryByText(/loading tasks/i))
}

describe('BoardPage', () => {
  it('announces that it is loading before the tasks arrive', () => {
    renderApp('/')

    // Scoped to `main` so this cannot match a status region elsewhere in the shell.
    const main = screen.getByRole('main')
    expect(within(main).getByRole('status')).toHaveTextContent(/loading tasks/i)
  })

  it('puts the fetched tasks into their columns', async () => {
    renderApp('/')
    await waitForBoard()

    expect(await screen.findByRole('heading', { name: 'Slack' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Todo (02)' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cancelled (01)' })).toBeInTheDocument()
  })

  it('shows an empty state when the API returns no tasks at all', async () => {
    server.use(graphql.query('Tasks', () => HttpResponse.json({ data: { tasks: [] } })))

    renderApp('/')
    await waitForBoard()

    expect(await screen.findByText(/no tasks yet/i)).toBeInTheDocument()
  })

  it('reports a failed query instead of showing an empty board', async () => {
    server.use(
      graphql.query('Tasks', () =>
        HttpResponse.json({ errors: [{ message: 'Internal server error' }] }),
      ),
    )

    renderApp('/')

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/could not load the board/i)
    expect(alert).toHaveTextContent(/internal server error/i)
  })

  it('retries the query when the user asks it to', async () => {
    let attempts = 0
    server.use(
      graphql.query('Tasks', ({ variables }) => {
        attempts += 1
        if (attempts === 1) {
          return HttpResponse.json({ errors: [{ message: 'Temporary failure' }] })
        }
        return HttpResponse.json({
          data: { tasks: taskStore.listTasks(variables.input as Record<string, never>) },
        })
      }),
    )
    const user = userEvent.setup()

    renderApp('/')
    await user.click(await screen.findByRole('button', { name: /try again/i }))

    expect(await screen.findByRole('heading', { name: 'Slack' })).toBeInTheDocument()
  })

  it('offers no retry for a rejected token, because retrying cannot fix it', async () => {
    server.use(
      graphql.query('Tasks', () =>
        HttpResponse.json({
          errors: [{ message: 'Unauthorized', extensions: { code: 'UNAUTHENTICATED' } }],
        }),
      ),
    )

    renderApp('/')

    expect(await screen.findByRole('alert')).toHaveTextContent(/access token was rejected/i)
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument()
  })

  it('says when the board is running on mocked data rather than the live API', async () => {
    // Tests always run without a token configured, which is the mock path.
    renderApp('/')
    await waitForBoard()

    expect(screen.getByText(/running on mocked data/i)).toBeInTheDocument()
  })
})
