import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp, userEvent } from '@/test/test-utils'

describe('AppSidebar', () => {
  it('marks the dashboard as the current page at the root URL', () => {
    renderApp('/')

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page')
  })

  it('does not mark the dashboard current on another route', () => {
    // `to="/"` matches every path by default, which would light up both tabs.
    renderApp('/settings')

    expect(screen.getByRole('link', { name: /dashboard/i })).not.toHaveAttribute('aria-current')
    expect(screen.getByRole('link', { name: /my task/i })).toHaveAttribute('aria-current', 'page')
  })

  it('moves the current marker when the user navigates', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getByRole('link', { name: /my task/i }))

    expect(screen.getByRole('link', { name: /my task/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /dashboard/i })).not.toHaveAttribute('aria-current')
  })

  it('names the navigation landmark so it can be jumped to', () => {
    renderApp('/')

    expect(screen.getByRole('navigation', { name: /main/i })).toBeInTheDocument()
  })

  it('renders the destinations exactly once', () => {
    // The navigation restyles across the breakpoint rather than being hidden and
    // repeated in the header. Repeating it is the tempting fix for "no navigation
    // on a phone" and it puts two of every link, and two navigation landmarks, in
    // the document at the same time.
    renderApp('/')

    expect(screen.getAllByRole('navigation', { name: /main/i })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: /dashboard/i })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: /my task/i })).toHaveLength(1)
  })
})
