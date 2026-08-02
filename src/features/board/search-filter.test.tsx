import { screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react'
import { graphql, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/mocks/server'
import { taskStore } from '@/mocks/task-store'
import { renderApp, userEvent } from '@/test/test-utils'

async function renderBoard(path = '/') {
  const user = userEvent.setup()
  const { router } = renderApp(path)
  await waitForElementToBeRemoved(() => screen.queryByText(/loading tasks/i))
  return { user, router }
}

/**
 * Records the filter input of every `Tasks` request, so a test can assert that
 * filtering happened *on the server* rather than by hiding cards locally.
 */
function recordTaskQueries() {
  const inputs: Record<string, unknown>[] = []
  server.use(
    graphql.query('Tasks', ({ variables }) => {
      const input = (variables as { input: Record<string, unknown> }).input
      inputs.push(input)
      return HttpResponse.json({ data: { tasks: taskStore.listTasks(input) } })
    }),
  )
  return inputs
}

describe('searching', () => {
  it('sends the search term to the API rather than filtering the loaded list', async () => {
    const inputs = recordTaskQueries()
    const { user } = await renderBoard()

    await user.type(screen.getByRole('searchbox', { name: /search tasks/i }), 'Slack')

    await waitFor(() => {
      expect(inputs.at(-1)).toMatchObject({ name: 'Slack' })
    })
  })

  it('shows only the matching tasks', async () => {
    const { user } = await renderBoard()

    await user.type(screen.getByRole('searchbox', { name: /search tasks/i }), 'Slack')

    expect(await screen.findByRole('heading', { name: 'Slack' })).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Twitter' })).not.toBeInTheDocument()
    })
  })

  it('waits for a pause rather than querying on every keystroke', async () => {
    const inputs = recordTaskQueries()
    const { user } = await renderBoard()
    const before = inputs.length

    await user.type(screen.getByRole('searchbox', { name: /search tasks/i }), 'Slack')
    await waitFor(() => {
      expect(inputs.at(-1)).toMatchObject({ name: 'Slack' })
    })

    // Five characters typed. Without debouncing that is five requests; with it,
    // far fewer — the exact count depends on typing speed, so this asserts the
    // property rather than a number.
    expect(inputs.length - before).toBeLessThan(5)
  })

  it('keeps the typed text visible immediately, even though the query waits', async () => {
    const { user } = await renderBoard()
    const field = screen.getByRole('searchbox', { name: /search tasks/i })

    await user.type(field, 'Sla')

    // Debouncing the input's own value instead of the derived one is the classic
    // mistake, and it shows up exactly here.
    expect(field).toHaveValue('Sla')
  })

  it('says nothing matched, distinctly from an empty board', async () => {
    const { user } = await renderBoard()

    await user.type(
      screen.getByRole('searchbox', { name: /search tasks/i }),
      'nothing matches this',
    )

    expect(await screen.findByText(/no tasks match these filters/i)).toBeInTheDocument()
    expect(screen.queryByText(/no tasks yet/i)).not.toBeInTheDocument()
  })
})

describe('filtering', () => {
  it('sends a chosen status to the API', async () => {
    const inputs = recordTaskQueries()
    const { user } = await renderBoard()

    await user.click(screen.getByRole('button', { name: /filter by status/i }))
    await user.click(await screen.findByRole('option', { name: 'Done' }))

    await waitFor(() => {
      expect(inputs.at(-1)).toMatchObject({ status: 'DONE' })
    })
  })

  it('narrows the board to the chosen status', async () => {
    const { user } = await renderBoard()

    await user.click(screen.getByRole('button', { name: /filter by status/i }))
    await user.click(await screen.findByRole('option', { name: 'Done' }))

    expect(await screen.findByRole('heading', { name: 'Tesla' })).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Slack' })).not.toBeInTheDocument()
    })
  })

  it('combines filters, sending them together', async () => {
    const inputs = recordTaskQueries()
    const { user } = await renderBoard()

    await user.click(screen.getByRole('button', { name: /filter by status/i }))
    await user.click(await screen.findByRole('option', { name: 'Todo' }))
    await user.click(screen.getByRole('button', { name: /filter by tags/i }))
    await user.click(await screen.findByRole('option', { name: 'React' }))

    await waitFor(() => {
      expect(inputs.at(-1)).toMatchObject({ status: 'TODO', tags: ['REACT'] })
    })
  })

  it('shows the empty-results state when a combination matches nothing', async () => {
    const { user } = await renderBoard()

    await user.click(screen.getByRole('button', { name: /filter by status/i }))
    await user.click(await screen.findByRole('option', { name: 'Done' }))
    await user.click(screen.getByRole('button', { name: /filter by tags/i }))
    await user.click(await screen.findByRole('option', { name: 'Rails' }))

    expect(await screen.findByText(/no tasks match these filters/i)).toBeInTheDocument()
  })

  it('offers a way out from the empty state itself, and restores the board', async () => {
    const { user } = await renderBoard()
    await user.click(screen.getByRole('button', { name: /filter by status/i }))
    await user.click(await screen.findByRole('option', { name: 'Done' }))
    await user.click(screen.getByRole('button', { name: /filter by tags/i }))
    await user.click(await screen.findByRole('option', { name: 'Rails' }))
    // Dismiss the still-open tag list. A multi-select stays open between picks,
    // and while it is open React Aria hides the rest of the page from the
    // accessibility tree — so the empty state below is not reachable yet.
    await user.keyboard('{Escape}')

    // The empty state carries its own reset, so the way out is where the user is
    // looking rather than back up in the filter bar. Both buttons exist and read
    // the same, so the click is scoped to the empty state's own region.
    const message = await screen.findByText(/no tasks match these filters/i)
    const empty = message.closest('[role="status"]')
    await user.click(within(empty as HTMLElement).getByRole('button', { name: /clear filters/i }))

    expect(await screen.findByRole('heading', { name: 'Slack' })).toBeInTheDocument()
  })

  it('sends nothing at all when no filter is set', async () => {
    const inputs = recordTaskQueries()
    await renderBoard()

    await waitFor(() => {
      expect(inputs.length).toBeGreaterThan(0)
    })
    // `{}` rather than `{ name: '' }` — an empty string would be a second cache
    // entry for the same unfiltered board.
    expect(inputs.at(-1)).toEqual({})
  })
})

describe('filters in the URL', () => {
  it('applies filters present in the address on first load', async () => {
    const inputs = recordTaskQueries()
    await renderBoard('/?status=DONE&tags=IOS')

    await waitFor(() => {
      expect(inputs.at(-1)).toMatchObject({ status: 'DONE', tags: ['IOS'] })
    })
  })

  it('ignores a value that is not a real member, rather than sending it on', async () => {
    // A hand-edited or stale URL is untrusted input; passing `nonsense` through
    // would turn a typo into an error screen.
    const inputs = recordTaskQueries()
    await renderBoard('/?status=NONSENSE')

    await waitFor(() => {
      expect(inputs.length).toBeGreaterThan(0)
    })
    expect(inputs.at(-1)).toEqual({})
  })

  it('writes a chosen filter into the address, so the view can be shared', async () => {
    const { user, router } = await renderBoard()

    await user.click(screen.getByRole('button', { name: /filter by status/i }))
    await user.click(await screen.findByRole('option', { name: 'Done' }))

    await waitFor(() => {
      expect(router.state.location.search).toContain('status=DONE')
    })
  })

  it('drops a filter from the address when it is cleared', async () => {
    const { user, router } = await renderBoard('/?status=DONE')

    await user.click((await screen.findAllByRole('button', { name: /clear filters/i }))[0])

    await waitFor(() => {
      expect(router.state.location.search).not.toContain('status')
    })
  })
})

describe('a failing filtered query', () => {
  it('reports the failure instead of looking like an empty result', async () => {
    const { user } = await renderBoard()
    server.use(
      graphql.query('Tasks', () => HttpResponse.json({ errors: [{ message: 'Filter rejected' }] })),
    )

    await user.click(screen.getByRole('button', { name: /filter by status/i }))
    await user.click(await screen.findByRole('option', { name: 'Done' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/filter rejected/i)
  })
})

describe('the clear control', () => {
  it('is absent when nothing is filtered, since it would do nothing', async () => {
    await renderBoard()

    expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument()
  })

  it('appears once a filter is set', async () => {
    await renderBoard('/?status=DONE')

    expect(await screen.findByRole('button', { name: /clear filters/i })).toBeInTheDocument()
  })
})
