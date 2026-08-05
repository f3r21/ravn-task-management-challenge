import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { makeTask, makeUser } from '@/mocks/task-fixtures'
import { renderWithProviders, userEvent } from '@/test/test-utils'
import { TaskCard } from './task-card'

const now = new Date('2026-08-02T12:00:00.000Z')

describe('TaskCard', () => {
  it('shows the task name as the card heading', () => {
    renderWithProviders(<TaskCard task={makeTask({ name: 'Slack' })} now={now} />)

    expect(screen.getByRole('heading', { name: 'Slack' })).toBeInTheDocument()
  })

  it('shows the point estimate as a count of points', () => {
    renderWithProviders(<TaskCard task={makeTask({ pointEstimate: 'EIGHT' })} now={now} />)

    expect(screen.getByText('8 Points')).toBeInTheDocument()
  })

  it('lists every tag on the task', () => {
    renderWithProviders(<TaskCard task={makeTask({ tags: ['IOS', 'RAILS'] })} now={now} />)

    expect(screen.getByText('iOS app')).toBeInTheDocument()
    expect(screen.getByText('Rails')).toBeInTheDocument()
  })

  it('renders no tag list at all when the task has no tags', () => {
    renderWithProviders(<TaskCard task={makeTask({ tags: [] })} now={now} />)

    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('names the due date rather than dating it when it is today', () => {
    renderWithProviders(
      <TaskCard task={makeTask({ dueDate: '2026-08-02T00:00:00.000Z' })} now={now} />,
    )

    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('states that an overdue task is overdue, instead of relying on colour alone', () => {
    renderWithProviders(
      <TaskCard task={makeTask({ dueDate: '2026-07-20T00:00:00.000Z' })} now={now} />,
    )

    expect(screen.getByText(/\(overdue\)/)).toBeInTheDocument()
  })

  it('does not claim a task is overdue when it is not', () => {
    renderWithProviders(
      <TaskCard task={makeTask({ dueDate: '2026-12-01T00:00:00.000Z' })} now={now} />,
    )

    expect(screen.queryByText(/\(overdue\)/)).not.toBeInTheDocument()
  })

  it('omits the due date badge when the API sends an unparseable date', () => {
    renderWithProviders(<TaskCard task={makeTask({ dueDate: 'nonsense' })} now={now} />)

    expect(screen.queryByText(/invalid date/i)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Slack' })).toBeInTheDocument()
  })

  it('names the assignee on their avatar', () => {
    renderWithProviders(
      <TaskCard task={makeTask({ assignee: makeUser({ fullName: 'Priya Nair' }) })} now={now} />,
    )

    expect(screen.getByRole('img', { name: 'Priya Nair' })).toBeInTheDocument()
  })

  it('says a task is unassigned rather than showing an empty avatar', () => {
    renderWithProviders(<TaskCard task={makeTask({ assignee: null })} now={now} />)

    expect(screen.getByRole('img', { name: 'Unassigned' })).toBeInTheDocument()
  })

  it('gives the options button a name that says which task it belongs to', () => {
    // Every card has one of these, so "options" alone would be ambiguous the
    // moment a screen reader user lists the buttons on the page.
    renderWithProviders(<TaskCard task={makeTask({ name: 'Google' })} now={now} />)

    expect(screen.getByRole('button', { name: 'Task options for Google' })).toBeInTheDocument()
  })

  it('hides the decorative counters from assistive tech, since nothing backs them', () => {
    const { container } = renderWithProviders(<TaskCard task={makeTask()} now={now} />)
    const card = within(container).getByRole('article')

    expect(card.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('keeps the delete option type-selectable despite its text being wrapped', async () => {
    // The Delete item's label is wrapped in a <span> so it can be coloured as a
    // destructive action, which costs it the `textValue` that plain-string
    // children supply for free — react-stately derives typeahead and the
    // accessible name from that, and warns when it cannot. An explicit
    // `textValue` restores both.
    //
    // Asserting on the warning rather than on typeahead itself is deliberate:
    // react-aria's typeahead is timer-driven and does not settle reliably in
    // jsdom, so a keystroke-based test here would be flaky. The warning fires
    // synchronously at collection-build time and is exact. Real typeahead was
    // confirmed separately in a browser.
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const user = userEvent.setup()
    renderWithProviders(<TaskCard task={makeTask({ name: 'Slack' })} now={now} />)

    await user.click(screen.getByRole('button', { name: 'Task options for Slack' }))

    expect(await screen.findByRole('menuitem', { name: 'Delete' })).toBeInTheDocument()
    expect(warn.mock.calls.flat().join('\n')).not.toMatch(/textValue/i)
  })
})
