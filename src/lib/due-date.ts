import { format, isValid, parseISO } from 'date-fns'

export type DueDateTone = 'overdue' | 'soon' | 'normal'

/**
 * Due dates are calendar dates, and this module reads them in UTC.
 *
 * The API types `dueDate` as a `DateTime` but uses it as a date: the values it
 * returns sit at midnight UTC. Interpreting those in the viewer's local zone
 * moves them. For anyone west of Greenwich, a task due `2026-08-02T00:00:00Z`
 * lands on 1 August local time and the card reads "Yesterday" — overdue, in red,
 * on a task that is not due until tomorrow. East of Greenwich the same bug
 * pushes dates a day late instead.
 *
 * Reading the calendar fields in UTC keeps a shared board saying the same thing
 * to everyone looking at it, which is the behaviour a team wants from a
 * deadline. The cost is that "today" is UTC's today; for a date with no time
 * component that is the right trade.
 */
const MS_PER_DAY = 86_400_000

function utcDayNumber(date: Date): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / MS_PER_DAY,
  )
}

/**
 * Re-projects a UTC calendar date onto local fields, so `date-fns` formatters —
 * which read local fields — render the UTC day.
 */
function asLocalCalendarDate(date: Date): Date {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

/** Whole calendar days from `now` to `dueDate`. Negative once the date is past. */
export function daysUntilDue(dueDate: Date, now: Date): number {
  return utcDayNumber(dueDate) - utcDayNumber(now)
}

/**
 * How a due date reads on a card.
 *
 * The design draws two states — a neutral badge, and a red one for a date in the
 * past. The brief additionally asks for a middle tier as a bonus: a warning when
 * the deadline is close. `soon` is that tier, covering today and tomorrow.
 *
 * The brief describes the safe tier as green; this returns `normal`, which
 * renders as the design's neutral badge. Green is already the `iOS app` tag
 * colour, and a green badge directly above a green chip reads as a relationship
 * that is not there. "Nothing to worry about" is what the neutral badge already
 * says.
 */
export function dueDateTone(dueDate: Date, now: Date): DueDateTone {
  const daysLeft = daysUntilDue(dueDate, now)
  if (daysLeft < 0) {
    return 'overdue'
  }
  if (daysLeft < 2) {
    return 'soon'
  }
  return 'normal'
}

/**
 * The badge text: named days for the three a user is most likely to be looking
 * for, and an explicit date otherwise, matching the design's "6 July, 2020".
 */
export function formatDueDate(dueDate: Date, now: Date): string {
  const daysLeft = daysUntilDue(dueDate, now)
  if (daysLeft === 0) {
    return 'Today'
  }
  if (daysLeft === -1) {
    return 'Yesterday'
  }
  if (daysLeft === 1) {
    return 'Tomorrow'
  }
  return format(asLocalCalendarDate(dueDate), 'd MMMM, yyyy')
}

/**
 * Parses an API date, returning `undefined` rather than an `Invalid Date`.
 *
 * `new Date('nonsense')` yields an object that passes every type check and then
 * renders as the literal text "Invalid Date" somewhere in the UI. Returning
 * `undefined` forces the caller to decide what a missing date looks like.
 */
export function parseApiDate(value: string): Date | undefined {
  const parsed = parseISO(value)
  return isValid(parsed) ? parsed : undefined
}

/** Formats a date for a `<input type="date">` value, in the same UTC frame. */
export function toDateInputValue(date: Date): string {
  return format(asLocalCalendarDate(date), 'yyyy-MM-dd')
}

/**
 * Re-projects a UTC instant onto local fields including the time, so a
 * formatter that reads local fields prints the UTC wall clock.
 */
function asUtcWallClock(date: Date): Date {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
  )
}

/**
 * An account timestamp — `createdAt`, `updatedAt` — rendered in UTC and labelled
 * as such.
 *
 * These are instants rather than calendar dates, so showing them in the viewer's
 * own zone would be defensible. They are shown in UTC anyway, for consistency:
 * due dates elsewhere in the app are read in UTC, and a screen that mixed the
 * two conventions would show two dates from the same API in two different
 * frames with nothing to say which was which. The suffix removes the ambiguity
 * that creates.
 */
export function formatUtcTimestamp(value: string): string {
  const parsed = parseApiDate(value)
  return parsed ? `${format(asUtcWallClock(parsed), "d MMMM yyyy 'at' HH:mm")} UTC` : 'Unknown'
}
