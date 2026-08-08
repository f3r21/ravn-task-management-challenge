import { isValid, parseISO } from 'date-fns'

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
 * Reads a date's fields in UTC, without going through local ones.
 *
 * The tempting shortcut is to build `new Date(y, m, d, H, M)` from the UTC getters so
 * that a formatter reading *local* fields prints the UTC clock. It is wrong in any
 * zone that skips an hour: the local time being asked for does not exist that day, the
 * engine resolves it forward, and the output is an hour late while still labelled UTC.
 * It is invisible at a fixed offset, which is why the suite's own UTC+14 could not
 * catch it — see the DST cases in the tests.
 *
 * `Intl` with an explicit `timeZone` has no such gap to fall into. The parts are
 * assembled by hand rather than taking a locale's own ordering, so the output keeps
 * the shape the design draws.
 */
const UTC_PARTS = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

function utcParts(date: Date): Record<string, string> {
  return Object.fromEntries(
    UTC_PARTS.formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  )
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
 * the deadline is close. `soon` is that tier, covering today and tomorrow, and
 * `normal` is the brief's "on time".
 *
 * The tiers are named for what the date *is*, not for what colour it takes, and
 * that separation is now what lets them cross a package boundary: the three names
 * are identical to `@ravn/ui-kit`'s `DueDateUrgency`, so a tone is handed to the
 * kit as-is and the palette mapping is the kit's own `DUE_DATE_URGENCY_COLOR`.
 * The app used to keep a second copy of that table beside its own badge; it does
 * not any more, which is why a repaint is now a kit release rather than an edit
 * here. See `task-card/to-kit-props.ts` for the hand-off.
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
  const { day, month, year } = utcParts(dueDate)
  return `${day} ${month}, ${year}`
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
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${String(date.getUTCFullYear())}-${month}-${day}`
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
  if (!parsed) {
    return 'Unknown'
  }
  const { day, month, year, hour, minute } = utcParts(parsed)
  return `${day} ${month} ${year} at ${hour}:${minute} UTC`
}
