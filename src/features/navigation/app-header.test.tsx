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

  it('offers no notifications control, because there is no notifications feature', () => {
    // **This asserts the opposite of what it used to, and the app is what was wrong.**
    // The header shipped a real `<button aria-label="Notifications">` with no handler: a
    // keyboard stop leading nowhere, announced as an affordance that did not exist.
    //
    // `@ravn/ui-kit`'s `TopNav` renders the bell as a button only when given
    // `onNotificationsClick`, and as a plain `<span>` otherwise, on the stated reasoning
    // that *"a button that does nothing is its own defect"*. No handler is passed because
    // there is nothing to wire, so the glyph is decoration and says so.
    //
    // The day a notifications feature exists, pass `onNotificationsClick` and this flips —
    // which is why it asserts the absence of the control rather than the presence of a
    // `<span>`, a shape that would also pass if the bell vanished entirely.
    renderApp('/')

    expect(screen.queryByRole('button', { name: /notifications/i })).not.toBeInTheDocument()
    // The header is still rendered; this is not passing because it failed to mount. The
    // search field rather than the avatar, which is a `Skeleton` until the profile resolves.
    expect(screen.getByRole('searchbox', { name: /search tasks/i })).toBeInTheDocument()
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

  describe('searching from a route that does not read the filter', () => {
    // The bar is rendered by `AppLayout` on every route, but only the board consumes
    // `?name=`. Typing on /settings used to write the parameter onto a URL nobody read:
    // the field filled, the clear button appeared, and nothing happened anywhere.

    it('takes the user to the board with the term applied', async () => {
      const user = userEvent.setup()
      renderApp('/settings')

      await user.type(screen.getByRole('searchbox', { name: /search tasks/i }), 'Slack')

      // The board, filtered — not /settings carrying a parameter it ignores.
      expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
      await screen.findByRole('heading', { name: 'Slack' })
    })

    it('shows an empty field off the board rather than a stale term', () => {
      // `filters.name` reads whatever route the user is on. Landing on /settings with a
      // leftover `?name=` in the URL must not present it as an active search.
      renderApp('/settings?name=Slack')

      expect(screen.getByRole('searchbox', { name: /search tasks/i })).toHaveValue('')
    })
  })
})
