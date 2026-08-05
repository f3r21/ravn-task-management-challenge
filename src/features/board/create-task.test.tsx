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

async function openCreateDialog() {
  const user = await renderBoard()
  await user.click(screen.getByRole('button', { name: /create task/i }))
  return { user, dialog: await screen.findByRole('dialog') }
}

describe('creating a task', () => {
  it('opens a named dialog from the + button', async () => {
    const { dialog } = await openCreateDialog()

    expect(dialog).toHaveAccessibleName('Create task')
  })

  it('puts focus in the title field so the user can start typing', async () => {
    await openCreateDialog()

    expect(screen.getByRole('textbox', { name: /task title/i })).toHaveFocus()
  })

  it('closes on Escape without creating anything', async () => {
    const { user } = await openCreateDialog()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('offers no position field, since createTask cannot accept one', async () => {
    // `CreateTaskInput` has no `position`: the server assigns it. A control here
    // would collect a value with nowhere to send it.
    const { dialog } = await openCreateDialog()

    expect(within(dialog).queryByRole('spinbutton', { name: /position/i })).not.toBeInTheDocument()
  })

  it('keeps Tab inside the dialog instead of letting it reach the page behind', async () => {
    const { user, dialog } = await openCreateDialog()

    // Enough tabs to walk past the last control and wrap. A modal that does not
    // contain focus drops it on <body> here, and the page behind is inert — so the
    // user is left with focus nowhere and every control unreachable.
    for (let press = 0; press < 12; press += 1) {
      await user.tab()
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    }
  })

  it('still closes on Escape after Tab has wrapped around', async () => {
    // Escape is bound to the dialog, so it only works while focus is inside it.
    // Losing focus to <body> made the modal impossible to dismiss from the keyboard.
    const { user } = await openCreateDialog()

    for (let press = 0; press < 12; press += 1) {
      await user.tab()
    }
    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('closes on Cancel', async () => {
    const { user, dialog } = await openCreateDialog()

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('refuses to submit an empty title and says why', async () => {
    const { user, dialog } = await openCreateDialog()

    await user.click(within(dialog).getByRole('button', { name: 'Create' }))

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(/give the task a name/i)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('returns focus to the title field when validation fails', async () => {
    const { user, dialog } = await openCreateDialog()

    await user.click(within(dialog).getByRole('button', { name: 'Create' }))

    expect(screen.getByRole('textbox', { name: /task title/i })).toHaveFocus()
  })

  it('adds the created task to the board', async () => {
    const { user, dialog } = await openCreateDialog()

    await user.type(screen.getByRole('textbox', { name: /task title/i }), 'Write the README')
    await user.click(within(dialog).getByRole('button', { name: 'Create' }))

    // The board refetches after the mutation, so this asserts the whole loop:
    // mutation, cache invalidation, refetch, render.
    expect(await screen.findByRole('heading', { name: 'Write the README' })).toBeInTheDocument()
  })

  it('keeps the dialog open and shows the reason when the mutation fails', async () => {
    server.use(
      graphql.mutation('CreateTask', () =>
        HttpResponse.json({ errors: [{ message: 'Name already taken' }] }),
      ),
    )
    const { user, dialog } = await openCreateDialog()

    await user.type(screen.getByRole('textbox', { name: /task title/i }), 'Duplicate')
    await user.click(within(dialog).getByRole('button', { name: 'Create' }))

    expect(await within(dialog).findByRole('alert')).toHaveTextContent(/name already taken/i)
    // Still open, so the user's typing is not thrown away by the failure.
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('keeps the status list open past the first frame it opens in', async () => {
    const { user, dialog } = await openCreateDialog()

    await user.click(within(dialog).getByRole('button', { name: /status/i }))
    expect(await screen.findByRole('option', { name: 'Done' })).toBeInTheDocument()
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.getByRole('option', { name: 'Done' })).toBeInTheDocument()
  })

  it('keeps the tags list open past the first frame it opens in', async () => {
    const { user, dialog } = await openCreateDialog()

    await user.click(within(dialog).getByRole('button', { name: /tags/i }))
    expect(await screen.findByRole('option', { name: 'React' })).toBeInTheDocument()
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.getByRole('option', { name: 'React' })).toBeInTheDocument()
  })

  it('lets the user pick a status, and files the task under it', async () => {
    const { user, dialog } = await openCreateDialog()

    await user.type(screen.getByRole('textbox', { name: /task title/i }), 'Ship it')
    await user.click(within(dialog).getByRole('button', { name: /status/i }))
    await user.click(await screen.findByRole('option', { name: 'Done' }))
    await user.click(within(dialog).getByRole('button', { name: 'Create' }))

    const done = await screen.findByRole('region', { name: /done/i })
    expect(await within(done).findByRole('heading', { name: 'Ship it' })).toBeInTheDocument()
  })

  it('keeps the points list open past the first frame it opens in', async () => {
    // Regression canary for the cross-module FocusScope bug: the kit's Modal once
    // resolved a different react-aria module instance than this app's own Select,
    // so a popover it nested lost focus-scope recognition and snapped shut a
    // couple of `requestAnimationFrame` ticks after opening. A bare synchronous
    // assertion right after the click would have passed even in that broken
    // state, since the close only happened a frame later — so this explicitly
    // waits past that frame before re-checking.
    const { user, dialog } = await openCreateDialog()

    await user.click(within(dialog).getByRole('button', { name: /estimated points/i }))
    expect(await screen.findByRole('option', { name: '1 Point' })).toBeInTheDocument()
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.getByRole('option', { name: '1 Point' })).toBeInTheDocument()
  })

  it('keeps the assignee list open past the first frame it opens in', async () => {
    const { user, dialog } = await openCreateDialog()

    await user.click(within(dialog).getByRole('button', { name: /assignee/i }))
    expect(await screen.findByRole('option', { name: /unassigned/i })).toBeInTheDocument()
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.getByRole('option', { name: /unassigned/i })).toBeInTheDocument()
  })

  it('lets the user pick several tags at once', async () => {
    const { user, dialog } = await openCreateDialog()

    await user.type(screen.getByRole('textbox', { name: /task title/i }), 'Tagged task')
    const tagsTrigger = within(dialog).getByRole('button', { name: /tags/i })
    await user.click(tagsTrigger)
    await user.click(await screen.findByRole('option', { name: 'React' }))
    // The list stays open between picks — that is the point of a multi-select.
    await user.click(screen.getByRole('option', { name: 'Rails' }))

    // Picking the second must not drop the first. React Aria's default
    // behaviour for a multi-selection list is to replace on a plain click, so
    // this is asserted on what the trigger paints, not only on the result.
    // The kit's MultiSelect shows the selection as the trigger's own
    // comma-separated value — one string, in the list's order, not the app's
    // old "Tags (2)" count and not the nested Tag chips the kit rendered while
    // its trigger was a white field.
    expect(screen.getByRole('option', { name: 'React' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', { name: 'Rails' })).toHaveAttribute('aria-selected', 'true')
    expect(tagsTrigger).toHaveTextContent('Rails, React')

    await user.click(tagsTrigger)

    await user.click(within(dialog).getByRole('button', { name: 'Create' }))

    const card = await screen.findByRole('article', { name: 'Tagged task' })
    expect(within(card).getByText('React')).toBeInTheDocument()
    expect(within(card).getByText('Rails')).toBeInTheDocument()
  })

  it('dismisses only the open list on Escape, leaving the dialog and its input intact', async () => {
    // Both layers listen for Escape. If the dialog also acted on it, the user
    // would lose a half-filled form by closing a dropdown.
    const { user, dialog } = await openCreateDialog()

    await user.type(screen.getByRole('textbox', { name: /task title/i }), 'Still here')
    await user.click(within(dialog).getByRole('button', { name: /tags/i }))
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByRole('option', { name: 'React' })).not.toBeInTheDocument()
    })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /task title/i })).toHaveValue('Still here')
  })

  it('hides the board behind it from assistive tech, same as the delete dialog', async () => {
    // Was a disclosed kit limitation, now fixed: the kit's Modal previously only
    // called react-aria's useOverlay + useDialog, never useModal/useModalOverlay,
    // so it never applied aria-hidden to the rest of the page the way the app's
    // own Dialog does for DeleteTaskDialog (see update-delete-task.test.tsx's
    // "reports a failed deletion..." test for that `hidden: true` case). The kit
    // now uses useModalOverlay, so both dialogs behave the same way here.
    await openCreateDialog()

    // `hidden: true` because the heading is now outside the accessibility
    // tree — which is the point of this test — and getByRole excludes
    // aria-hidden elements by default (see update-delete-task.test.tsx's
    // "reports a failed deletion..." test for the same pattern).
    expect(isInaccessible(screen.getByRole('heading', { name: 'Slack', hidden: true }))).toBe(true)
  })

  it('starts from a blank form each time it is opened', async () => {
    const { user, dialog } = await openCreateDialog()

    await user.type(screen.getByRole('textbox', { name: /task title/i }), 'Abandoned draft')
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    await user.click(screen.getByRole('button', { name: /create task/i }))

    expect(await screen.findByRole('textbox', { name: /task title/i })).toHaveValue('')
  })
})
