import { createElement, type ComponentProps } from 'react'
import { graphql, HttpResponse } from 'msw'
import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { server } from '@/mocks/server'
import { makeTask } from '@/mocks/task-fixtures'
import { renderApp, userEvent } from '@/test/test-utils'
import type * as UiKit from '@ravn/ui-kit'
import { BOARD_STATUSES } from './task-types'

/**
 * What one keystroke in the header search box costs the board.
 *
 * The header writes to the URL on every keystroke, which is a router state update,
 * so the whole matched route re-renders. Nothing about that is avoidable — what is
 * avoidable is the board re-rendering *with* it, rebuilding every card's twenty-odd
 * elements for a character that does not reach the API for another 300ms.
 *
 * The instrument is `Avatar`, counted through a module mock rather than a counter
 * added to `TaskCard` itself. That placement is the whole trick: `Avatar` is
 * rendered *inside* `TaskCard`, so it is downstream of the memo boundary. Counting
 * `TaskCard` from the outside would count React's *attempts* to render it, which
 * `memo` does not change — the number would stay flat across exactly the fix this
 * measures, and read as no improvement.
 *
 * **Card avatars are counted separately from the header's**, and that separation is
 * what makes both assertions sharp rather than merely true:
 *
 * - The closing assertion is `cards === 0`. A count that lumped the two together
 *   would assert `=== 1`, a number the header alone satisfies — so a board that had
 *   stopped rendering cards entirely would pass it. Zero is not reachable that way.
 * - The opening assertion is `cards === 150`, which proves the board really did
 *   mount every card before anything was measured. Without it the test could go
 *   green having measured nothing at all, which is the shape this repo has already
 *   paid for four times — most memorably a Tailwind canary that generated the very
 *   classes it grepped for.
 *
 * The header count is deliberately *not* asserted. It is 2 at mount, not 1: the
 * profile query resolves and `AppHeader` renders again. That is timing-dependent,
 * so pinning it would buy nothing and flake.
 *
 * `TaskCard` renders exactly one `Avatar`, unconditionally — it passes
 * `task.assignee?.avatar`, so an unassigned task still gets the initials fallback.
 * The split relies on the header being the only caller asking for `size={40}`
 * (`app-header.tsx`); every card takes the 32px default.
 *
 * Both asserted numbers are re-derived by a green run, since the assertions *are*
 * the numbers:
 *
 *     npx vitest run src/features/board/board-render-cost.test.tsx
 *
 * The unmemoised figure is the one thing CI cannot assert, because asserting it
 * would mean keeping the code broken. Reproduce it by dropping the `memo()` wrapper
 * in `task-card.tsx` and running the same command, which fails
 * `expected 150 to be 0` — 150 cards re-rendering for one character.
 *
 * There is deliberately no `console.log` reporting the counts: Vitest buffers
 * test-side console output and prints it only for failing tests, so on a green run
 * it would emit nothing and the figure would look sourced when it was not.
 */
const renders = vi.hoisted(() => ({ cards: 0, header: 0 }))

vi.mock('@ravn/ui-kit', async (importOriginal) => {
  const actual = await importOriginal<typeof UiKit>()
  return {
    ...actual,
    Avatar: (props: ComponentProps<typeof actual.Avatar>) => {
      // `size="md"` is the header's, `"sm"` the card's. Both are explicit since
      // app#30 swapped this component for the kit's, whose default is `md` —
      // relying on "the card passes no size", as this did, would now count every
      // card as a header and read as zero card renders.
      if (props.size === 'md') {
        renders.header += 1
      } else {
        renders.cards += 1
      }
      return createElement(actual.Avatar, props)
    },
  }
})

/** Big enough that a per-card cost is unmistakable, and the size the issue names. */
const TASK_COUNT = 150

function manyTasks(count: number) {
  return Array.from({ length: count }, (_, index) =>
    makeTask({
      id: `perf-${String(index)}`,
      name: `Perf task ${String(index)}`,
      position: index,
      status: BOARD_STATUSES[index % BOARD_STATUSES.length],
    }),
  )
}

describe('board render cost', () => {
  // A generous explicit timeout, because this is the one test in the suite that
  // mounts 150 cards through the real route table and the real client. It runs in
  // about a second and a half on an idle machine; the default 5s left it failing
  // as a timeout — not as a wrong count — on a loaded one, which would read as a
  // regression in the thing it measures.
  it('does not re-render the cards when a keystroke only changes the search text', async () => {
    // Answers with the same 150 tasks whatever the filter, so the measurement is
    // the render cost of a keystroke and not the list quietly getting shorter.
    server.use(
      graphql.query('Tasks', () => HttpResponse.json({ data: { tasks: manyTasks(TASK_COUNT) } })),
    )

    // `delay: null` types the character without waiting between events, so the
    // 300ms search debounce cannot fire mid-measurement and fold a refetch's
    // renders into the keystroke's.
    const user = userEvent.setup({ delay: null })
    renderApp('/')

    // Both ends of the board rather than just the first card, so the counter
    // cannot be reset while part of the initial render is still outstanding —
    // anything landing after the reset would be counted against the keystroke.
    //
    // The explicit timeouts are what stop this being flaky, and they are a
    // different knob from the `it()` budget below: `findBy*` has its own deadline,
    // testing-library's `asyncUtilTimeout`, which this repo leaves at its 1000ms
    // default. Mounting 150 cards through the real route table does not reliably
    // finish inside that on a loaded machine, and when it does not the failure is
    // "Unable to find role=heading" — which reads like the board never rendered
    // rather than like a machine under load.
    await screen.findByRole('heading', { name: 'Perf task 0' }, { timeout: 20_000 })
    await screen.findByRole(
      'heading',
      { name: `Perf task ${String(TASK_COUNT - 1)}` },
      { timeout: 20_000 },
    )

    // The board really is fully mounted — see the note above on why measuring
    // nothing must not look like measuring zero.
    expect(renders.cards).toBe(TASK_COUNT)

    // The board is up. Everything counted from here belongs to the keystroke.
    renders.cards = 0

    await user.type(
      await screen.findByRole('searchbox', { name: 'Search tasks' }, { timeout: 20_000 }),
      'a',
    )

    // Not one card re-renders. The header's own avatar does — it is inside the
    // component that owns the input — and is counted separately so it cannot
    // satisfy this on its own.
    expect(renders.cards).toBe(0)
  }, 30_000)
})
