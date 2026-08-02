import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders, userEvent } from '@/test/test-utils'
import { BoardToolbar } from './board-toolbar'

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
