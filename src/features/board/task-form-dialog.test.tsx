import { screen } from '@testing-library/react'
import { useOverlayTriggerState } from 'react-stately'
import { describe, expect, it, vi } from 'vitest'
import { makeUser } from '@/mocks/task-fixtures'
import { renderWithProviders, userEvent } from '@/test/test-utils'
import { TaskFormDialog } from './task-form-dialog'
import type { TaskFormFields } from './task-form-state'

type DialogProps = Parameters<typeof TaskFormDialog>[0]

/** Supplies real overlay state, so the test does not mirror the library's shape. */
function OpenDialog(props: Omit<DialogProps, 'state'>) {
  const state = useOverlayTriggerState({ defaultOpen: true })
  return <TaskFormDialog state={state} {...props} />
}

/**
 * Rendered directly rather than through the board: the seam is the component's own
 * props, so the position field is exercised without driving a mutation. The edit flow
 * that supplies `mode="edit"` is covered end to end in `update-delete-task.test.tsx`.
 */
function renderDialog(props: Partial<Omit<DialogProps, 'state'>> = {}) {
  const user = userEvent.setup()
  const onSubmit = vi.fn<(fields: TaskFormFields) => Promise<void>>().mockResolvedValue(undefined)
  renderWithProviders(
    <OpenDialog
      users={[makeUser()]}
      onSubmit={onSubmit}
      title="Edit Slack"
      submitLabel="Save"
      {...props}
    />,
  )
  return { user, onSubmit }
}

describe('TaskFormDialog', () => {
  it('offers a position field when editing', () => {
    // §4 lists position among the fields the update modal must expose, and
    // `UpdateTaskInput.position` accepts it.
    renderDialog({ mode: 'edit' })

    expect(screen.getByRole('spinbutton', { name: /position/i })).toBeInTheDocument()
  })

  it('seeds the position field from the task being edited', () => {
    renderDialog({ mode: 'edit', initialFields: { position: '3' } })

    expect(screen.getByRole('spinbutton', { name: /position/i })).toHaveValue(3)
  })

  it('submits the edited position', async () => {
    const { user, onSubmit } = renderDialog({
      mode: 'edit',
      initialFields: { name: 'Slack', position: '3' },
    })

    const position = screen.getByRole('spinbutton', { name: /position/i })
    await user.clear(position)
    await user.type(position, '12')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ position: '12' }))
  })

  it('cannot be made to submit a non-number', async () => {
    // The number input sanitises: a partial value like a lone minus sign reports as
    // the empty string, so there is no keystroke sequence that reaches the form's
    // "position has to be a number" branch. That branch guards `initialFields`,
    // which is seeded from code rather than typed, and it is tested directly
    // against `validateTaskForm`. Pinned here so nobody adds a UI-level test for a
    // state the UI cannot produce.
    const { user, onSubmit } = renderDialog({
      mode: 'edit',
      initialFields: { name: 'Slack', position: '3' },
    })

    const position = screen.getByRole('spinbutton', { name: /position/i })
    await user.clear(position)
    await user.type(position, '-')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ position: '' }))
  })

  it('accepts a cleared position, leaving the order as the server has it', async () => {
    const { user, onSubmit } = renderDialog({
      mode: 'edit',
      initialFields: { name: 'Slack', position: '3' },
    })

    await user.clear(screen.getByRole('spinbutton', { name: /position/i }))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ position: '' }))
  })

  it("offers a delete action when editing, wired to the caller's onDelete", async () => {
    const onDelete = vi.fn()
    const { user } = renderDialog({ mode: 'edit', onDelete })

    await user.click(screen.getByRole('button', { name: /delete task/i }))

    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('offers no delete action when creating, even if onDelete is somehow passed', () => {
    renderDialog({ onDelete: vi.fn() })

    expect(screen.queryByRole('button', { name: /delete task/i })).not.toBeInTheDocument()
  })

  it('renders no delete action when editing without an onDelete handler', () => {
    renderDialog({ mode: 'edit' })

    expect(screen.queryByRole('button', { name: /delete task/i })).not.toBeInTheDocument()
  })
})
