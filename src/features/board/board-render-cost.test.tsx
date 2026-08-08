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
 * The instrument is the kit's `Menu`, counted through a module mock rather than a
 * counter added to a card. That placement is the whole trick: the menu is rendered
 * *inside* each card, so it is downstream of the memo boundary. Counting the memoised
 * component from the outside would count React's *attempts* to render it, which
 * `memo` does not change — the number would stay flat across exactly the fix this
 * measures, and read as no improvement.
 *
 * **The instrument used to be `Avatar`, and the board migration made that one blind.**
 * Worth writing down, because the failure was silent in the dangerous direction: the
 * board now renders `@ravn/ui-kit`'s `TaskCard`, which calls the kit's *internal*
 * `Avatar` rather than importing it from the barrel this file mocks. So the mock
 * stopped intercepting card avatars entirely and the opening count fell to zero —
 * caught here only because that opening assertion exists. Had the test asserted just
 * the closing `=== 0`, a completely blind instrument would have reported a perfect
 * score. A mock of a package barrel only sees what the *app* imports through it.
 *
 * `Menu` is what the app still imports through the barrel, and it is a better
 * instrument than `Avatar` was: `TaskActionsMenu` is the only thing in the app that
 * renders one (`grep -rn --include='*.tsx' '<Menu' src`), exactly one per task, in
 * both the board and the list view. The label filter is belt-and-braces so that
 * adding a menu elsewhere later cannot quietly pollute the count.
 *
 * Both assertions stay sharp for the same reasons as before:
 *
 * - The closing assertion is `cards === 0`, and nothing else in the app renders a
 *   `Menu`, so zero cannot be reached by some other component satisfying it.
 * - The opening assertion is `cards === 150`, which proves the board really did
 *   mount every card before anything was measured. Without it the test could go
 *   green having measured nothing at all — which is not hypothetical here, it is
 *   precisely what the `Avatar` instrument started doing.
 *
 * Both asserted numbers are re-derived by a green run, since the assertions *are*
 * the numbers:
 *
 *     npx vitest run src/features/board/board-render-cost.test.tsx
 *
 * The unmemoised figure is the one thing CI cannot assert, because asserting it
 * would mean keeping the code broken. Reproduce it by dropping the `memo()` wrapper
 * in `board-column.tsx` and running the same command, which fails
 * `expected 150 to be 0` — 150 cards re-rendering for one character. **That wrapper
 * moved**: it used to sit on each `TaskCard`, and the kit's `TaskListView` builds its
 * own cards from a props array and memoises none of them, so the boundary is now the
 * column. One boundary per column instead of one per card, and it skips the column
 * header too.
 *
 * There is deliberately no `console.log` reporting the counts: Vitest buffers
 * test-side console output and prints it only for failing tests, so on a green run
 * it would emit nothing and the figure would look sourced when it was not.
 */
const renders = vi.hoisted(() => ({ cards: 0 }))

vi.mock('@ravn/ui-kit', async (importOriginal) => {
  const actual = await importOriginal<typeof UiKit>()
  return {
    ...actual,
    Menu: (props: ComponentProps<typeof actual.Menu>) => {
      // Only the per-task menus, named for the task they belong to. Nothing else in
      // the app renders a `Menu` today; this keeps that from being load-bearing.
      if (typeof props.label === 'string' && props.label.startsWith('Task options for')) {
        renders.cards += 1
      }
      return createElement(actual.Menu, props)
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

    // Not one card re-renders. The header re-renders — it is the component that owns
    // the input — but it renders no `Menu`, so it cannot satisfy this on its own.
    expect(renders.cards).toBe(0)
  }, 30_000)
})
