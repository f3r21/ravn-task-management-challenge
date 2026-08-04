import { isInaccessible } from '@testing-library/dom'
import { screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react'
import { graphql, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '@/mocks/server'
import { renderApp, userEvent } from '@/test/test-utils'

async function renderBoard() {
  const user = userEvent.setup()
  renderApp('/')
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

  it('leaves the fields it was not asked to change alone', async () => {
    // Every field the form holds is resent on save, so dropping one from the payload
    // — or seeding it wrongly — silently wipes it. Renaming a task is the cheapest way
    // to prove the fields it does not touch survive the round trip. Slack carries two
    // tags, 4 points, a due date and an assignee, none of which this edit changes.
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Edit')
    const dialog = await screen.findByRole('dialog')

    const title = within(dialog).getByRole('textbox', { name: /task title/i })
    await user.clear(title)
    await user.type(title, 'Slack integration')
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    const card = (await screen.findByRole('heading', { name: 'Slack integration' })).closest(
      'article',
    )
    expect(card).not.toBeNull()
    const within_ = within(card as HTMLElement)
    expect(within_.getByText('iOS app')).toBeInTheDocument()
    expect(within_.getByText('Android')).toBeInTheDocument()
    expect(within_.getByText('4 Points')).toBeInTheDocument()
    expect(within_.getByText('14 August, 2026')).toBeInTheDocument()
    expect(within_.getByRole('img', { name: 'Alicia Koch' })).toBeInTheDocument()
  })

  it('can take an assignee off a task', async () => {
    // The API models `assigneeId` as nullable and the card already knows how to
    // render "Unassigned", but the picker offered no way to get there: the option
    // did not exist, and `handleEdit` dropped the field whenever it was empty — so
    // once a task had an owner it kept that owner permanently.
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Edit')
    const dialog = await screen.findByRole('dialog')

    await user.click(within(dialog).getByRole('button', { name: /assignee/i }))
    await user.click(await screen.findByRole('option', { name: /unassigned/i }))
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    const card = (await screen.findByRole('heading', { name: 'Slack' })).closest('article')
    expect(
      within(card as HTMLElement).getByRole('img', { name: /unassigned/i }),
    ).toBeInTheDocument()
  })

  it('reorders a task within its column by editing its position', async () => {
    // §4 lists position among the editable fields. Slack sits above Google in Todo
    // because it has the lower position; pushing it past Google swaps them.
    const user = await renderBoard()
    const todo = screen.getByRole('region', { name: /todo/i })
    expect(
      within(todo)
        .getAllByRole('heading', { level: 3 })
        .map((h) => h.textContent),
    ).toEqual(['Slack', 'Google'])

    await chooseAction(user, 'Slack', 'Edit')
    const dialog = await screen.findByRole('dialog')
    const position = within(dialog).getByRole('spinbutton', { name: /position/i })
    await user.clear(position)
    await user.type(position, '99')
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(
        within(screen.getByRole('region', { name: /todo/i }))
          .getAllByRole('heading', { level: 3 })
          .map((h) => h.textContent),
      ).toEqual(['Google', 'Slack'])
    })
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

  it('returns focus to the card that opened it', async () => {
    // Focus was dropped on `<body>` here, so cancelling a delete on the seventh card
    // sent the user back to the top of the document to tab down again.
    //
    // The create dialog does not have this problem, which is what hid it: React Aria
    // records what to restore to when the dialog first renders, and on this path the
    // menu item that was focused is unmounting in that same commit — so the recorded
    // element is already detached and gets discarded.
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Delete')
    const dialog = await screen.findByRole('alertdialog', { name: /delete slack/i })

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Task options for Slack' })).toHaveFocus()
    })
  })

  it('describes the consequence, not only the title', async () => {
    // `alertdialog` was chosen over `dialog` precisely so the body text is
    // announced on open rather than the name alone. That only happens if the
    // description is wired: `useDialog` generates the id and points
    // `aria-describedby` at it, but only survives if an element carries it.
    const user = await renderBoard()

    await chooseAction(user, 'Slack', 'Delete')

    const dialog = await screen.findByRole('alertdialog', { name: /delete slack/i })
    expect(dialog).toHaveAccessibleDescription(/cannot be undone/i)
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

  it('announces a failed deletion, rather than putting the message somewhere inert', async () => {
    // The dialog stays open on failure and carries no inline error by design, so
    // this notification is the only report the user gets. It renders inside the
    // subtree React Aria marks `inert` while a modal is open, which takes it out of
    // the accessibility tree — so a screen-reader user is told nothing at all and
    // the Delete button simply re-enables.
    server.use(
      graphql.mutation('DeleteTask', () =>
        HttpResponse.json({ errors: [{ message: 'Task is locked' }] }),
      ),
    )
    const user = await renderBoard()
    await chooseAction(user, 'Slack', 'Delete')
    const dialog = await screen.findByRole('alertdialog')

    await user.click(within(dialog).getByRole('button', { name: 'Delete' }))

    // `isInaccessible` is Testing Library's own answer to "can assistive tech reach
    // this", which is the actual question — it walks the ancestors for `aria-hidden`
    // and for display/visibility. Checking `[inert]` by hand does not work here:
    // React Aria assigns the `inert` *property*, jsdom does not reflect it to an
    // attribute, and the page behind a modal ends up `aria-hidden` regardless.
    const notification = await screen.findByText(/task is locked/i)
    // Named, because a React Aria toast is itself an `alertdialog` — a focusable,
    // non-modal one — so an unqualified query matches both it and the confirmation.
    expect(screen.getByRole('alertdialog', { name: /delete slack/i })).toBeInTheDocument()
    expect(isInaccessible(notification)).toBe(false)
  })
})
