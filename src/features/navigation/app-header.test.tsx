import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders, userEvent } from '@/test/test-utils'
import { AppHeader } from './app-header'

describe('AppHeader', () => {
  it('renders search as a real text field, not the button the mockup draws', () => {
    renderWithProviders(<AppHeader />)

    expect(screen.getByRole('searchbox', { name: /search tasks/i })).toBeInTheDocument()
  })

  it('keeps the field labelled once the placeholder is gone', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AppHeader searchValue="" onSearchChange={vi.fn()} />)

    const field = screen.getByRole('searchbox', { name: /search tasks/i })
    await user.type(field, 'a')

    // The accessible name comes from the label, so it survives typing.
    expect(screen.getByRole('searchbox', { name: /search tasks/i })).toBe(field)
  })

  it('reports what the user typed', async () => {
    const user = userEvent.setup()
    const onSearchChange = vi.fn()
    renderWithProviders(<AppHeader searchValue="" onSearchChange={onSearchChange} />)

    await user.type(screen.getByRole('searchbox'), 'sl')

    expect(onSearchChange).toHaveBeenCalledWith('s')
  })

  it('names the icon-only notification button', () => {
    renderWithProviders(<AppHeader />)

    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
  })
})
