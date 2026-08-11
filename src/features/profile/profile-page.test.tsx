import { screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react'
import { graphql, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { makeUser } from '@/mocks/task-fixtures'
import { server } from '@/mocks/server'
import { renderApp, userEvent } from '@/test/test-utils'

async function renderProfile() {
  const user = userEvent.setup()
  renderApp('/settings')
  await waitForElementToBeRemoved(() => screen.queryByText(/loading your profile/i))
  return user
}

describe('the settings page', () => {
  it('announces that it is loading', () => {
    renderApp('/settings')

    // Scoped to `main` so this cannot match a status region elsewhere in the shell.
    const main = screen.getByRole('main')
    expect(within(main).getByRole('status')).toHaveTextContent(/loading your profile/i)
  })

  it('announces from a region that outlives the loading state', async () => {
    // A live region reports *changes* to its contents, so one that mounts with its
    // text already inside announces nothing — the mistake the board's skeleton and
    // the empty state were both corrected for. This page kept it: the region lived
    // inside `ProfileSkeleton` and was unmounted the moment the data arrived.
    const { container } = renderApp('/settings')
    const main = screen.getByRole('main')
    const region = within(main).getByRole('status')

    await waitFor(() => {
      expect(region).not.toHaveTextContent(/loading your profile/i)
    })
    // Same node throughout — not a fresh one carrying different text.
    expect(container.contains(region)).toBe(true)
    expect(within(main).getByRole('status')).toBe(region)
  })

  it('shows every field the API exposes on a user', async () => {
    server.use(
      graphql.query('Profile', () =>
        HttpResponse.json({
          data: {
            profile: makeUser({
              fullName: 'Alicia Koch',
              email: 'alicia@ravn.co',
              type: 'ADMIN',
              createdAt: '2026-01-04T09:30:00.000Z',
              updatedAt: '2026-03-17T14:05:00.000Z',
            }),
          },
        }),
      ),
    )
    await renderProfile()

    const details = screen.getByRole('heading', { name: 'Alicia Koch' }).closest('section')
    const list = within(details as HTMLElement)

    expect(list.getByText('Full name')).toBeInTheDocument()
    expect(list.getAllByText('Alicia Koch').length).toBeGreaterThan(0)
    expect(list.getByText('Email')).toBeInTheDocument()
    expect(list.getByText('alicia@ravn.co')).toBeInTheDocument()
    expect(list.getByText('Type')).toBeInTheDocument()
    expect(list.getByText('Admin')).toBeInTheDocument()
    expect(list.getByText('Created at')).toBeInTheDocument()
    expect(list.getByText('Updated at')).toBeInTheDocument()
  })

  it('pairs each label with its value, so the two are read together', async () => {
    await renderProfile()

    // A description list carries the pairing as structure. Without it a screen
    // reader announces two unrelated strings that happen to be adjacent.
    const term = screen.getByText('Email')
    expect(term.tagName).toBe('DT')
    expect(term.nextElementSibling?.tagName).toBe('DD')
  })

  it('shows initials instead of what the decommissioned avatar host serves', async () => {
    server.use(
      graphql.query('Profile', () =>
        HttpResponse.json({
          data: {
            profile: makeUser({
              fullName: 'Grace Stone',
              // A real value from the live API. The host is gone but answers 410
              // with a valid placeholder SVG, so the image loads and `onError`
              // never fires — the URL has to be discarded before it reaches an
              // `<img>`. Text inside the avatar is what proves it was.
              avatar: 'https://avatars.dicebear.com/api/initials/gs.svg',
            }),
          },
        }),
      ),
    )
    await renderProfile()

    // Scoped to the page's own section: the header renders an avatar for the same
    // person, and this is about the one on the settings page.
    const details = screen.getByRole('heading', { name: 'Grace Stone' }).closest('section')

    expect(
      within(details as HTMLElement).getByRole('img', { name: 'Grace Stone' }),
    ).toHaveTextContent('GS')
  })

  it('renders account timestamps in UTC and says so', async () => {
    server.use(
      graphql.query('Profile', () =>
        HttpResponse.json({
          data: {
            profile: makeUser({
              createdAt: '2026-01-04T09:30:00.000Z',
              updatedAt: '2026-03-17T14:05:00.000Z',
            }),
          },
        }),
      ),
    )
    await renderProfile()

    // The suite runs at UTC+14. A formatter reading local fields would print
    // "4 January 2026 at 23:30" here — right date by luck, wrong time — and
    // would shift the date outright for any instant near midnight UTC.
    expect(screen.getByText('4 January 2026 at 09:30 UTC')).toBeInTheDocument()
    expect(screen.getByText('17 March 2026 at 14:05 UTC')).toBeInTheDocument()
  })

  it('says so rather than rendering "Invalid Date" for a timestamp it cannot parse', async () => {
    server.use(
      graphql.query('Profile', () =>
        HttpResponse.json({ data: { profile: makeUser({ updatedAt: 'not a date' }) } }),
      ),
    )
    await renderProfile()

    expect(screen.getByText('Unknown')).toBeInTheDocument()
    expect(screen.queryByText(/invalid date/i)).not.toBeInTheDocument()
  })

  it('labels a candidate as such', async () => {
    server.use(
      graphql.query('Profile', () =>
        HttpResponse.json({ data: { profile: makeUser({ type: 'CANDIDATE' }) } }),
      ),
    )
    await renderProfile()

    expect(screen.getByText('Candidate')).toBeInTheDocument()
  })

  it('reports a failed query with a way to retry', async () => {
    server.use(
      graphql.query('Profile', () =>
        HttpResponse.json({ errors: [{ message: 'Profile unavailable' }] }),
      ),
    )
    renderApp('/settings')

    expect(await screen.findByRole('alert')).toHaveTextContent(/profile unavailable/i)
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('offers no retry for a rejected token, since retrying cannot fix it', async () => {
    server.use(
      graphql.query('Profile', () =>
        HttpResponse.json({
          errors: [{ message: 'Unauthorized', extensions: { code: 'UNAUTHENTICATED' } }],
        }),
      ),
    )
    renderApp('/settings')

    expect(await screen.findByRole('alert')).toHaveTextContent(/access token was rejected/i)
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument()
  })

  it('is reachable from the header avatar, now that the sidebar points elsewhere', async () => {
    // The sidebar's "My task" item used to point at /settings — see app#155 for
    // why that changed. This page is still reachable, just from a different
    // entry point: the avatar in the header.
    const user = userEvent.setup()
    renderApp('/')

    await user.click(await screen.findByRole('link', { name: /settings/i }))

    expect(await screen.findByRole('heading', { name: 'Settings', level: 1 })).toBeInTheDocument()
  })
})

describe('the header avatar', () => {
  it('names the signed-in user, sharing the settings page query', async () => {
    server.use(
      graphql.query('Profile', () =>
        HttpResponse.json({ data: { profile: makeUser({ fullName: 'Priya Nair' }) } }),
      ),
    )
    renderApp('/')

    // One query key, so the header and the settings page cannot disagree about
    // who is signed in — and the request is made once however many ask.
    expect(await screen.findByRole('img', { name: 'Priya Nair' })).toBeInTheDocument()
  })

  it("shows initials when the signed-in user's avatar is on the dead host", async () => {
    server.use(
      graphql.query('Profile', () =>
        HttpResponse.json({
          data: {
            profile: makeUser({
              fullName: 'Grace Stone',
              avatar: 'https://avatars.dicebear.com/api/initials/gs.svg',
            }),
          },
        }),
      ),
    )
    // Nobody on the seeded board is called Grace Stone, so the only avatar with
    // this name is the header's.
    renderApp('/')

    expect(await screen.findByRole('img', { name: 'Grace Stone' })).toHaveTextContent('GS')
  })
})
