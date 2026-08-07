import { graphql, HttpResponse } from 'msw'
import { screen, waitForElementToBeRemoved, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { server } from '@/mocks/server'
import { taskStore } from '@/mocks/task-store'
import { renderApp, userEvent } from '@/test/test-utils'

/**
 * The pickers must show names that arrive *after* they first render.
 *
 * This is the one failure `board-render-cost.test.tsx` structurally cannot catch,
 * and the distinction is worth stating because from a distance the two look
 * alike. Both guards there are *performance* assertions: they count renders. A
 * frozen option label is a *correctness* bug that renders perfectly — the right
 * components, in the right places, at the right time, showing the wrong text. No
 * render count moves, so a green suite says nothing about it.
 *
 * The mechanism it guards: react-stately's `CollectionBuilder` caches each built
 * node in a `WeakMap` keyed on the item object, with no invalidation. A hit
 * returns without calling the renderer at all. So a render function that reads
 * anything outside its argument — the shape both of these pickers had, doing
 * `users.find(…)` inline — is called once per item and then never again, and
 * serves whatever it resolved on the first build for as long as that array
 * lives. Both pickers below build their first collection while the directory is
 * still in flight, which is precisely when that resolves to nothing.
 *
 * Two halves keep it safe and a change must keep both: every option carries its
 * own precomputed `label`, and `renderSelectOption` closes over nothing. Hoisting
 * the option arrays to module scope while leaving a closure in the render prop is
 * the natural "simplification" that reintroduces it — and it would look like a
 * pure win in review.
 */

/** A `Users` handler that answers only when the test says so. */
function gatedUsersQuery() {
  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })

  server.use(
    graphql.query('Users', async () => {
      await gate
      return HttpResponse.json({ data: { users: taskStore.listUsers() } })
    }),
  )

  return { releaseDirectory: release }
}

describe('a picker whose directory arrives late', () => {
  it('shows the owner filter’s names once the directory loads', async () => {
    const { releaseDirectory } = gatedUsersQuery()
    const user = userEvent.setup()
    renderApp('/')
    await waitForElementToBeRemoved(() => screen.queryByText(/loading tasks/i))

    // Opened while the directory is still in flight, so the collection is built —
    // and cached — from an empty option list. Asserting the absence first is what
    // gives the rest of the test its teeth: without it, this would pass against a
    // picker that simply had the names all along.
    await user.click(screen.getByRole('button', { name: /filter by owner/i }))
    expect(await screen.findByRole('option', { name: 'Any owner' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Priya Nair' })).not.toBeInTheDocument()

    releaseDirectory()

    expect(await screen.findByRole('option', { name: 'Priya Nair' })).toBeInTheDocument()
  })

  it('shows the assignee picker’s names once the directory loads', async () => {
    const { releaseDirectory } = gatedUsersQuery()
    const user = userEvent.setup()
    renderApp('/')
    await waitForElementToBeRemoved(() => screen.queryByText(/loading tasks/i))

    await user.click(screen.getByRole('button', { name: /create task/i }))
    const dialog = await screen.findByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: /assignee/i }))
    expect(await screen.findByRole('option', { name: 'Unassigned' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Priya Nair' })).not.toBeInTheDocument()

    releaseDirectory()

    expect(await screen.findByRole('option', { name: 'Priya Nair' })).toBeInTheDocument()
  })
})
