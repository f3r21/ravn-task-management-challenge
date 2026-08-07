import { graphql, HttpResponse } from 'msw'
import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { server } from '@/mocks/server'
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

  it('does not claim to know who is signed in when the profile fails', async () => {
    // `Avatar` falls back to "Unassigned", which is correct for a task nobody owns
    // and a lie about the current user — so a failed profile fetch used to be
    // indistinguishable from a working one.
    server.use(
      graphql.query('Profile', () => HttpResponse.json({ errors: [{ message: 'Not permitted' }] })),
    )
    renderApp('/')

    const header = within(await screen.findByRole('banner'))
    expect(
      await header.findByRole('img', { name: 'Could not load your profile' }),
    ).toBeInTheDocument()
    // Scoped to the header: the board behind it legitimately shows "Unassigned"
    // avatars for tasks nobody owns, which is exactly the word this fix stops the
    // header from borrowing.
    expect(header.queryByRole('img', { name: 'Unassigned' })).not.toBeInTheDocument()
  })
})
