import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderApp, userEvent } from '@/test/test-utils'

describe('routes', () => {
  it('renders the dashboard at the root path', () => {
    renderApp('/')

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('renders the settings page at /settings', () => {
    renderApp('/settings')

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('renders the my-task page at /my-task', () => {
    renderApp('/my-task')

    expect(screen.getByRole('heading', { name: 'My task' })).toBeInTheDocument()
  })

  it('renders a sample page at a placeholder destination, not the not-found page', () => {
    // §2 asks for menu items "most of them" leading to a placeholder page, so
    // these routes exist on purpose. The distinction being pinned is that they are
    // *not* the not-found page: sending a working nav item there would read as a
    // broken link, and the two are otherwise easy to conflate into one route.
    renderApp('/calendar')

    expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /does not exist/i })).not.toBeInTheDocument()
  })

  it('keeps the app shell around a placeholder page, unlike the not-found page', () => {
    // The not-found page renders outside `AppLayout` deliberately — chrome around
    // it would imply the app is fine. A placeholder is the opposite case: the app
    // *is* fine, so the navigation stays and the current item stays marked.
    renderApp('/team')

    expect(screen.getByRole('navigation', { name: /main/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Team' })).toHaveAttribute('aria-current', 'page')
  })

  it('renders a not-found page for an unknown path, rather than a blank screen', () => {
    renderApp('/does-not-exist')

    expect(screen.getByRole('heading', { name: /does not exist/i })).toBeInTheDocument()
  })

  it('navigates back to the dashboard from the not-found page', async () => {
    const user = userEvent.setup()
    renderApp('/does-not-exist')

    await user.click(screen.getByRole('link', { name: /back to the dashboard/i }))

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })
})
