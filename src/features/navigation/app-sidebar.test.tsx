import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp, userEvent } from '@/test/test-utils'
import { NAV_ITEMS } from './app-sidebar'

describe('AppSidebar', () => {
  it.each(NAV_ITEMS.map(({ to, label }) => [label, to]))(
    'lands %s on a real page rather than the not-found route',
    (label, to) => {
      // §2 wants more menu items than the brief's six sections build, so three of
      // these lead to sample pages — but every one of them still has to *go*
      // somewhere. This is the check that a link and its route cannot drift apart:
      // add an item with no matching route and it falls through to `path: '*'`,
      // which looks like a dead link and nothing else here would notice.
      renderApp(to)

      expect(screen.queryByRole('heading', { name: /does not exist/i })).not.toBeInTheDocument()
      expect(screen.getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page')
    },
  )

  it('marks the dashboard as the current page at the root URL', () => {
    renderApp('/')

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('aria-current', 'page')
  })

  it('does not mark the dashboard current on another route', () => {
    // `to="/"` matches every path by default, which would light up both tabs.
    renderApp('/my-task')

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
