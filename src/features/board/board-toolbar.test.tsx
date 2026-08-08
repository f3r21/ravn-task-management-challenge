import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders, userEvent } from '@/test/test-utils'
import { BoardToolbar, readView } from './board-toolbar'

describe('readView', () => {
  /*
   * Tested directly rather than through the component, and that is the point of it
   * being a named function at all.
   *
   * React Aria only ever reports a value it rendered a radio for, so the call site's
   * "names no view" branch is unreachable through the UI — a test driving the toolbar
   * can exercise one direction and never the other. Both directions are the whole
   * check here: a lookup that answered `undefined` for *everything* satisfies "an
   * unknown view is dropped" perfectly and breaks the switcher outright, and only the
   * first case below can tell those two apart.
   */
  it('returns the view a known value names', () => {
    expect(readView('grid')).toBe('grid')
    expect(readView('list')).toBe('list')
  })

  it('drops a value naming no view, rather than passing it through', () => {
    expect(readView('nonsense')).toBeUndefined()
    expect(readView('')).toBeUndefined()
    // The label, not the value — a plausible near-miss rather than obvious rubbish.
    expect(readView('Grid view')).toBeUndefined()
  })
})

describe('BoardToolbar', () => {
  it('exposes the layout options as a radio group, so the choice is announced', () => {
    renderWithProviders(<BoardToolbar view="grid" onViewChange={vi.fn()} onCreateTask={vi.fn()} />)

    expect(screen.getByRole('radiogroup', { name: /board layout/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /grid view/i })).toBeChecked()
    expect(screen.getByRole('radio', { name: /list view/i })).not.toBeChecked()
  })

  it('reports the newly chosen layout', async () => {
    const user = userEvent.setup()
    const onViewChange = vi.fn()
    renderWithProviders(
      <BoardToolbar view="grid" onViewChange={onViewChange} onCreateTask={vi.fn()} />,
    )

    await user.click(screen.getByRole('radio', { name: /list view/i }))

    expect(onViewChange).toHaveBeenCalledWith('list')
  })

  // The roles above are the easy half. These two are the behaviour the group was
  // chosen *for*, and the hand-rolled `role="radio"` version passed every
  // role assertion while providing neither.
  it('moves the selection with an arrow key', async () => {
    const user = userEvent.setup()
    const onViewChange = vi.fn()
    renderWithProviders(
      <BoardToolbar view="grid" onViewChange={onViewChange} onCreateTask={vi.fn()} />,
    )

    screen.getByRole('radio', { name: /grid view/i }).focus()
    await user.keyboard('{ArrowLeft}')

    expect(onViewChange).toHaveBeenCalledWith('list')
  })

  it('is a single tab stop, not one per option', async () => {
    const user = userEvent.setup()
    renderWithProviders(<BoardToolbar view="grid" onViewChange={vi.fn()} onCreateTask={vi.fn()} />)

    // A roving tabindex means Tab reaches the group once and then leaves it. Two
    // independently tabbable radios would make the second press land on "List
    // view" instead of moving on to the create button.
    await user.tab()
    expect(screen.getByRole('radio', { name: /grid view/i })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: /create task/i })).toHaveFocus()
  })

  it('has a create button with a name, not just a plus glyph', () => {
    renderWithProviders(<BoardToolbar view="grid" onViewChange={vi.fn()} onCreateTask={vi.fn()} />)

    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument()
  })

  it('reports a create request', async () => {
    const user = userEvent.setup()
    const onCreateTask = vi.fn()
    renderWithProviders(
      <BoardToolbar view="grid" onViewChange={vi.fn()} onCreateTask={onCreateTask} />,
    )

    await user.click(screen.getByRole('button', { name: /create task/i }))

    expect(onCreateTask).toHaveBeenCalledOnce()
  })
})
