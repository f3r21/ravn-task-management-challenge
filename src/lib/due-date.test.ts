import { describe, expect, it } from 'vitest'
import {
  daysUntilDue,
  dueDateTone,
  formatDueDate,
  formatUtcTimestamp,
  parseApiDate,
  toDateInputValue,
} from './due-date'

const now = new Date('2026-08-02T12:00:00.000Z')

describe('dueDateTone', () => {
  it('marks a date in the past as overdue', () => {
    expect(dueDateTone(new Date('2026-08-01T12:00:00.000Z'), now)).toBe('overdue')
  })

  it('marks today as soon rather than overdue, even later in the day', () => {
    // The deadline is 09:00 and it is now 12:00. Comparing instants would call
    // this overdue; users would not.
    expect(dueDateTone(new Date('2026-08-02T09:00:00.000Z'), now)).toBe('soon')
  })

  it('marks tomorrow as soon', () => {
    expect(dueDateTone(new Date('2026-08-03T00:00:00.000Z'), now)).toBe('soon')
  })

  it('marks two days out as normal, which is where the warning tier ends', () => {
    expect(dueDateTone(new Date('2026-08-04T00:00:00.000Z'), now)).toBe('normal')
  })

  it('marks a distant date as normal', () => {
    expect(dueDateTone(new Date('2026-12-25T00:00:00.000Z'), now)).toBe('normal')
  })
})

describe('formatDueDate', () => {
  it('names today, yesterday and tomorrow rather than dating them', () => {
    expect(formatDueDate(new Date('2026-08-02T18:00:00.000Z'), now)).toBe('Today')
    expect(formatDueDate(new Date('2026-08-01T06:00:00.000Z'), now)).toBe('Yesterday')
    expect(formatDueDate(new Date('2026-08-03T06:00:00.000Z'), now)).toBe('Tomorrow')
  })

  it('spells out anything further away', () => {
    expect(formatDueDate(new Date('2026-09-06T00:00:00.000Z'), now)).toBe('6 September, 2026')
  })
})

/**
 * Why this module reads UTC calendar fields rather than local ones.
 *
 * The whole suite runs at UTC+14 (see `vite.config.ts`), so these assertions are
 * made from the most extreme offset there is. Swap any `getUTC*` call in
 * `due-date.ts` for its local equivalent and every one of them fails: a task due
 * at midnight UTC would read as tomorrow, and a date printed for the board would
 * name the wrong day.
 */
describe('timezone independence', () => {
  it('is running at UTC+14, or the rest of this block proves nothing', () => {
    // Guards the guard: if the suite ever drifts back to UTC, these assertions
    // would keep passing while testing nothing, so the offset is asserted
    // outright. -840 minutes is Pacific/Kiritimati, which has no DST.
    expect(new Date().getTimezoneOffset()).toBe(-840)
  })

  it('reads midnight-UTC as the day it represents', () => {
    expect(formatDueDate(new Date('2026-08-02T00:00:00.000Z'), now)).toBe('Today')
  })

  it('does not shift a spelled-out date across the day boundary', () => {
    expect(formatDueDate(new Date('2026-09-06T00:00:00.000Z'), now)).toBe('6 September, 2026')
  })

  it('does not call a future date overdue', () => {
    expect(dueDateTone(new Date('2026-08-02T00:00:00.000Z'), now)).not.toBe('overdue')
  })

  it('keeps a date input value on the same day the badge shows', () => {
    expect(toDateInputValue(new Date('2026-08-02T00:00:00.000Z'))).toBe('2026-08-02')
  })
})

describe('daysUntilDue', () => {
  it('counts whole calendar days, ignoring the time of day', () => {
    expect(daysUntilDue(new Date('2026-08-05T23:59:00.000Z'), now)).toBe(3)
    expect(daysUntilDue(new Date('2026-08-05T00:01:00.000Z'), now)).toBe(3)
  })

  it('goes negative once the date is past', () => {
    expect(daysUntilDue(new Date('2026-07-30T00:00:00.000Z'), now)).toBe(-3)
  })
})

describe('parseApiDate', () => {
  it('parses an ISO timestamp from the API', () => {
    expect(parseApiDate('2026-08-02T00:00:00.000Z')?.toISOString()).toBe('2026-08-02T00:00:00.000Z')
  })

  it('returns undefined for a value that would become an Invalid Date', () => {
    // Without this guard the card renders the literal text "Invalid Date".
    expect(parseApiDate('not a date')).toBeUndefined()
  })
})

describe('toDateInputValue', () => {
  it('formats for a date input in the same UTC frame the badge reads', () => {
    expect(toDateInputValue(new Date('2026-08-02T00:00:00.000Z'))).toBe('2026-08-02')
  })
})

describe('formatUtcTimestamp', () => {
  it('renders an account timestamp in UTC, labelled', () => {
    expect(formatUtcTimestamp('2026-01-04T09:30:00.000Z')).toBe('4 January 2026 at 09:30 UTC')
  })

  it('does not shift the wall clock into the viewer’s zone', () => {
    // The suite runs at UTC+14. A formatter reading local fields would print
    // 23:30 here, and would move the date outright for an instant near midnight.
    expect(formatUtcTimestamp('2026-01-04T23:30:00.000Z')).toBe('4 January 2026 at 23:30 UTC')
  })

  it('says so rather than producing "Invalid Date"', () => {
    expect(formatUtcTimestamp('not a date')).toBe('Unknown')
  })
})
