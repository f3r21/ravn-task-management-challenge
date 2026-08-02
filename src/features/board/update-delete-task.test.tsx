import { screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react'
import { graphql, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/mocks/server'
import { renderWithProviders, userEvent } from '@/test/test-utils'
import { BoardPage } from './board-page'

async function renderBoard() {
  const user = userEvent.setup()
  renderWithProviders(<BoardPage />)
  await waitForElementToBeRemoved(() => screen.queryByText(/loading tasks/i))
  return user
}

/** Opens the three-dot menu on a named card and picks one of its actions. */
async function chooseAction(
  user: ReturnType<typeof userEvent.setup>,
  taskName: string,
  action: 'Edit' | 'Delete',
) {
  await user.click(screen.getByRole('button', { name: `Task options for ${taskName}` }))
  await user.click(await screen.findByRole('menuitem', { name: action }))
}

describe('the task options menu', () => {
  it('names its trigger after the task, since every card has one', async () => {
    await renderBoard()

    expect(screen.getByRole('button', { name: 'Task options for Slack' })).toBeInTheDocument()
  })

  it('offers edit and delete', async () => {
    const user = await renderBoard()

    await user.click(screen.getByRole('button', { name: 'Task options for Slack' }))

    const menu = await screen.findByRole('menu')
    expect(within(menu).getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument()
    expect(within(menu).getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument()
  })

  it('opens on the keyboard and closes on Escape', async () => {
    const user = await renderBoard()
    const trigger = screen.getByRole('button', { name: 'Task options for Slack' })

    trigger.focus()
    await user.keyboard('{Enter}')
    expect(await screen.findByRole('menu')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    })
  })
})

describe('editing a task', () => {
  it('opens a dialog already holding the task it was opened for', async () => {
    const user = await renderBoard()

    await chooseAction(user, 'Slack', 'Edit')

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName('Edit Slack')
    // Seeded, not blank — otherwise "edit" would mean "retype everything".
    expect(within(dialog).getByRole('textbox', { name: /task title/i })).toHaveValue('Slack')
  })

  it('saves a renamed task and shows it on the board', async () => {
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Edit')
    const dialog = await screen.findByRole('dialog')

    const title = within(dialog).getByRole('textbox', { name: /task title/i })
    await user.clear(title)
    await user.type(title, 'Slack integration')
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    expect(await screen.findByRole('heading', { name: 'Slack integration' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Slack' })).not.toBeInTheDocument()
  })

  it('confirms the save with a notification', async () => {
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Edit')
    const dialog = await screen.findByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Task updated')).toBeInTheDocument()
  })

  it('moves a task to another column when its status changes', async () => {
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Edit')
    const dialog = await screen.findByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: /status/i }))
    await user.click(await screen.findByRole('option', { name: 'Cancelled' }))
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    const cancelled = await screen.findByRole('region', { name: /cancelled/i })
    expect(await within(cancelled).findByRole('heading', { name: 'Slack' })).toBeInTheDocument()
  })

  it('keeps the dialog open and reports why when the save fails', async () => {
    server.use(
      graphql.mutation('UpdateTask', () =>
        HttpResponse.json({ errors: [{ message: 'Task is locked' }] }),
      ),
    )
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Edit')
    const dialog = await screen.findByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(/task is locked/i)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('cancels without changing anything', async () => {
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Edit')
    const dialog = await screen.findByRole('dialog')

    const title = within(dialog).getByRole('textbox', { name: /task title/i })
    await user.clear(title)
    await user.type(title, 'Discarded')
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: 'Slack' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Discarded' })).not.toBeInTheDocument()
  })
})

describe('deleting a task', () => {
  it('asks for confirmation, naming the task, before deleting anything', async () => {
    const user = await renderBoard()

    await chooseAction(user, 'Slack', 'Delete')

    // `alertdialog`, so the consequence is announced rather than just the title.
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveTextContent(/delete “slack”\?/i)
    expect(dialog).toHaveTextContent(/cannot be undone/i)
  })

  it('leaves the task alone when the user cancels', async () => {
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Delete')
    const dialog = await screen.findByRole('alertdialog')

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: 'Slack' })).toBeInTheDocument()
  })

  it('removes the task once confirmed', async () => {
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Delete')
    const dialog = await screen.findByRole('alertdialog')

    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Slack' })).not.toBeInTheDocument()
    })
    expect(screen.getByRole('heading', { name: 'Todo (01)' })).toBeInTheDocument()
  })

  it('confirms the deletion with a notification', async () => {
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Delete')
    const dialog = await screen.findByRole('alertdialog')

    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    expect(await screen.findByText('Task deleted')).toBeInTheDocument()
  })

  it('reports a failed deletion and leaves the task in place', async () => {
    server.use(
      graphql.mutation('DeleteTask', () =>
        HttpResponse.json({ errors: [{ message: 'Not permitted' }] }),
      ),
    )
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Delete')
    const dialog = await screen.findByRole('alertdialog')

    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    expect(await screen.findByText(/not permitted/i)).toBeInTheDocument()
    // `hidden: true` because the dialog is still open and a modal removes the
    // page behind it from the accessibility tree — which is the point of a
    // modal. The task itself is still on the board.
    expect(screen.getByRole('heading', { name: 'Slack', hidden: true })).toBeInTheDocument()
  })
})
