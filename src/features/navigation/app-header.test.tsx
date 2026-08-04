import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp, userEvent } from '@/test/test-utils'

/**
 * Rendered through the real router, because the header's search field writes to
 * the URL — that is the mechanism under test, not an implementation detail.
 */
describe('AppHeader', () => {
  it('renders search as a real text field, not the button the mockup draws', () => {
    renderApp('/')

    expect(screen.getByRole('searchbox', { name: /search tasks/i })).toBeInTheDocument()
  })

  it('keeps the field labelled once the placeholder is gone', async () => {
    const user = userEvent.setup()
    renderApp('/')

    const field = screen.getByRole('searchbox', { name: /search tasks/i })
    await user.type(field, 'a')

    // The accessible name comes from the label, so it survives typing.
    expect(screen.getByRole('searchbox', { name: /search tasks/i })).toBe(field)
  })

  it('shows what the URL already says, so a shared link arrives with search filled in', () => {
    renderApp('/?name=slack')

    expect(screen.getByRole('searchbox', { name: /search tasks/i })).toHaveValue('slack')
  })

  it('records what the user typed', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.type(screen.getByRole('searchbox', { name: /search tasks/i }), 'sla')

    expect(screen.getByRole('searchbox', { name: /search tasks/i })).toHaveValue('sla')
  })

  it('names the icon-only notification button', () => {
    renderApp('/')

    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
  })
})
