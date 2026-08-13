import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest'
import { server } from './src/mocks/server'
import { taskStore } from './src/mocks/task-store'

/*
 * The suite runs at a fixed instant, because due dates are rendered relative to now.
 *
 * `formatDueDate` names the three days a user looks for — "Today", "Yesterday", "Tomorrow" —
 * and prints a date otherwise. Both it and `toKitCardProps` take `now` as a parameter, so the
 * unit tests inject one and are deterministic by construction. The COMPONENT layer reads the
 * clock through `useCurrentDay()`, so a component test asserting a rendered date was really
 * asserting a function of the calendar, against fixtures whose dates are fixed.
 *
 * That is a bomb with a date on it rather than a flake. On 2026-08-13 the card for a task due
 * 2026-08-14 correctly rendered "Tomorrow" and `update-delete-task` failed looking for
 * "14 August, 2026" — the app was right, the test was wrong, and the suite had been green for
 * months. `board-column`'s "20 July, 2026" carries the same charge; its window has passed.
 *
 * Moving the fixture dates or the literals only resets the timer. The seam is `now`, the
 * production code already has it, and this is how the component layer reaches it.
 *
 * ONLY `Date` IS FAKED. Faking timers wholesale would break `userEvent` and `waitFor`, which
 * need real ones to advance; `shouldAdvanceTime` keeps the clock moving so a `waitFor` that is
 * going to fail still times out rather than hanging on a deadline that can never arrive. The one
 * interval in production code — `useCurrentDay`'s minute poll — compares two reads of the same
 * fake clock and so correctly concludes the day has not rolled over.
 *
 * The instant is the one `due-date.test.ts` and `to-kit-props.test.ts` already use, so the whole
 * suite has a single answer to "what day is it".
 */
const SUITE_NOW = new Date('2026-08-02T12:00:00.000Z')

/*
 * A test that logs an error or a warning fails.
 *
 * **Why this is a gate and not a lint.** React reports real defects through
 * `console.error` and nothing else — `act()` warnings, invalid nesting, a key
 * collision, `useLayoutEffect` on the server. None of them fail a test. This suite
 * emitted `An update to BoardToolbar inside a test was not wrapped in act(...)` on
 * every run for long enough that it appeared in an issue as a known finding, and it
 * was still green the whole time. A warning nobody has to act on is a warning nobody
 * acts on.
 *
 * The gate is reinstalled in `beforeEach` rather than once, and that is load-bearing
 * given this project's config: `restoreMocks` is not set, so a test that installs
 * `vi.spyOn(console, 'error')` leaves it installed. Hooked once, the first such test
 * would silently disable the gate for every test after it in the same file — the
 * inert-guard failure this repo has already paid for in `.claude/hooks/`. Reassigning
 * per test means a leaked spy is overwritten before the next one runs.
 *
 * **The allowlist is the spy itself, deliberately.** A test that genuinely expects a
 * console call already writes `vi.spyOn(console, 'error').mockImplementation(() => {})`,
 * which replaces this wrapper for that test, so nothing is recorded and the gate does
 * not fire. That makes "I meant this one" a thing you say in the test rather than in a
 * list somewhere else that goes stale — three tests rely on it today
 * (`error-boundary`, `toast-context`, and `board-column`'s `textValue` assertion, which
 * asserts on the warning's *absence* and so needs the spy to read it at all).
 *
 * Calls are forwarded to the real console before failing, because a gate that swallows
 * the message replaces a visible warning with an invisible one and makes the failure
 * harder to diagnose than the thing it was catching.
 */
const consoleCalls: string[] = []

function record(method: 'error' | 'warn', original: (...args: unknown[]) => void) {
  return (...args: unknown[]) => {
    consoleCalls.push(`console.${method}: ${args.map(String).join(' ')}`)
    original(...args)
  }
}

/*
 * `onUnhandledRequest: 'error'` is the point of this setup, not a detail. Without
 * it a test whose handler is missing silently falls through to the real network:
 * it either hangs, or — worse — passes against live data. Failing loudly means a
 * missing handler is a test failure with a useful message.
 */
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

const realConsoleError = console.error.bind(console)
const realConsoleWarn = console.warn.bind(console)

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'], shouldAdvanceTime: true, now: SUITE_NOW })
  consoleCalls.length = 0
  console.error = record('error', realConsoleError)
  console.warn = record('warn', realConsoleWarn)
})

afterEach(() => {
  // Before the console gate below, so a test that leaves the clock faked cannot make the next
  // one's failure look like a warning problem.
  vi.useRealTimers()
  cleanup()
  // Handlers a test installed with `server.use()` are per-test overrides. Reset
  // so one test's stubbed failure cannot leak into the next test's happy path.
  server.resetHandlers()
  // The mock store is stateful on purpose — creating a task really adds one —
  // which means it also has to be rolled back, or a test that creates a task
  // changes the board every later test sees.
  taskStore.reset()

  // Last, so a genuine assertion failure in the test body reports first — this would
  // otherwise mask it with a message about a warning that was probably its symptom.
  const seen = [...consoleCalls]
  consoleCalls.length = 0
  if (seen.length > 0) {
    throw new Error(
      `Test logged ${String(seen.length)} console message(s). React reports real defects ` +
        `this way and nothing else fails on them, so this is a failure.\n\n` +
        `${seen.join('\n')}\n\n` +
        `If the call is deliberate, say so in the test with ` +
        `\`vi.spyOn(console, 'error').mockImplementation(() => {})\` — that replaces this ` +
        `hook for that test, which is how the three existing cases opt out.`,
    )
  }
})

afterAll(() => {
  server.close()
})
