import { screen, waitFor, within } from '@testing-library/react'
import { graphql, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { makeUser } from '@/mocks/task-fixtures'
import { server } from '@/mocks/server'
import { taskStore } from '@/mocks/task-store'
import { renderApp, userEvent } from '@/test/test-utils'

/**
 * No shared "wait for loading to finish" step, unlike the board's own
 * `renderBoard` helper — this page has two sequential loads (the profile, then
 * the tasks it gates), and MSW usually resolves both before a first check would
 * even see the loading text mounted. Each test below waits for its own
 * end-state directly instead.
 */
function renderMyTask() {
  const user = userEvent.setup()
  renderApp('/my-task')
  return user
}

/**
 * Records the filter input of every `Tasks` request, the same way
 * `search-filter.test.tsx` proves the board filters server-side rather than by
 * hiding cards locally — here proving which *field* the request carries.
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

describe('MyTaskPage', () => {
  it('filters by assigneeId, never ownerId', async () => {
    // The regression this page exists to fix: `ownerId` matches every seeded
    // task's creator, so filtering by it would show the whole board under a "my
    // task" heading. `assigneeId` is what actually scopes the list to the
    // signed-in user — see app#155.
    const inputs = recordTaskQueries()
    renderMyTask()

    // Waiting for a task to render is what proves the request actually landed,
    // rather than checking `inputs` before the response has come back.
    expect(await screen.findByRole('heading', { name: 'Slack' })).toBeInTheDocument()

    // The seeded profile is `SEED_USERS[0]` (`user-1`).
    expect(inputs).toContainEqual({ assigneeId: 'user-1' })
    expect(inputs.some((input) => 'ownerId' in input)).toBe(false)
  })

  it("shows only the signed-in user's assigned tasks, not the whole board", async () => {
    renderMyTask()

    // Seeded as assigned to `user-1`: "Slack" and "Samsung". "Google" is assigned
    // to a different user and must not appear.
    expect(await screen.findByRole('heading', { name: 'Slack' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Samsung' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Google' })).not.toBeInTheDocument()
  })

  it('shows an empty state for a user with nothing assigned, rather than the whole board', async () => {
    // An id no seeded task is assigned to, so this is testing "assigneeId matched
    // nothing" rather than accidentally matching a real seed relationship.
    server.use(
      graphql.query('Profile', () =>
        HttpResponse.json({ data: { profile: makeUser({ id: 'nobody', fullName: 'Nobody' }) } }),
      ),
    )
    renderMyTask()

    expect(await screen.findByText('No tasks assigned to you')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Slack' })).not.toBeInTheDocument()
  })

  it('still supports editing a task from this list, not just displaying it', async () => {
    // `TaskTableRow`'s actions menu is always rendered, so if this page passed no
    // `onEditTask` the menu would still show "Edit" and clicking it would do
    // nothing — a dead menu item rather than a missing one. This proves it works.
    const user = renderMyTask()

    await user.click(await screen.findByRole('button', { name: 'Task options for Slack' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Edit' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName('Edit Slack')

    const title = within(dialog).getByRole('textbox', { name: /task title/i })
    await user.clear(title)
    await user.type(title, 'Slack integration')
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    expect(await screen.findByRole('heading', { name: 'Slack integration' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Slack' })).not.toBeInTheDocument()
  })

  it('also supports deleting a task from this list', async () => {
    const user = renderMyTask()

    await user.click(await screen.findByRole('button', { name: 'Task options for Slack' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Delete' }))

    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveTextContent(/delete slack/i)
    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Slack' })).not.toBeInTheDocument()
    })
    // "Samsung" is still assigned to this user and must survive deleting "Slack".
    expect(screen.getByRole('heading', { name: 'Samsung' })).toBeInTheDocument()
  })
})
