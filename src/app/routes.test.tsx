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

    expect(screen.getByRole('heading', { name: /my task/i })).toBeInTheDocument()
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
