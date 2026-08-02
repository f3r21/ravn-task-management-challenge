import { screen, waitForElementToBeRemoved, within } from '@testing-library/react'
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

    // Scoped to `main`: the notification region is also a live region.
    const main = screen.getByRole('main')
    expect(within(main).getByRole('status')).toHaveTextContent(/loading your profile/i)
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

  it('is reachable from the sidebar', async () => {
    const user = userEvent.setup()
    renderApp('/')

    await user.click(screen.getByRole('link', { name: /my task/i }))

    expect(await screen.findByRole('heading', { name: 'My task', level: 1 })).toBeInTheDocument()
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
})
