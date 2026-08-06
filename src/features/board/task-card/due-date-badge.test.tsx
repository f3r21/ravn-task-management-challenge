import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/test-utils'
import { DueDateBadge } from './due-date-badge'

const now = new Date('2026-08-02T12:00:00.000Z')

/**
 * The one place in this suite that asserts on a class name.
 *
 * Colour is the entire content of the brief's fourth bonus item, and it has no
 * perceivable surface for a role-or-text query to reach: the badge's text is the
 * date in all three tiers, and only `overdue` adds words. Everything else this
 * repo tests is behaviour, so the exception is worth stating rather than
 * spreading — asserting the tone class here is what stops the green tier being
 * quietly mapped back to neutral, which is where it sat until this change.
 *
 * The classes come from `Tag`'s own `TONE_CLASSES` (labels moved off the fill
 * colour where a measurement forced it, hence `secondary-2` under a
 * `secondary-4` tint). This pins which tone the badge asks for, not what that
 * tone is worth in contrast — the kit computes those from the tokens.
 */
describe('DueDateBadge', () => {
  it.each([
    ['green when the deadline is still days away', '2026-08-10T00:00:00.000Z', 'text-secondary-2'],
    ['amber when it is today or tomorrow', '2026-08-03T00:00:00.000Z', 'text-tertiary-4'],
    ['red once it is past', '2026-07-20T00:00:00.000Z', 'text-danger-text'],
  ])('paints the badge %s', (_case, dueDate, toneClass) => {
    const { container } = renderWithProviders(
      <DueDateBadge dueDate={new Date(dueDate)} now={now} />,
    )

    expect(container.firstElementChild).toHaveClass(toneClass)
  })

  it('still says "overdue" in words, so the colour is never the only signal', () => {
    renderWithProviders(<DueDateBadge dueDate={new Date('2026-07-20T00:00:00.000Z')} now={now} />)

    expect(screen.getByText(/\(overdue\)/)).toBeInTheDocument()
  })
})
