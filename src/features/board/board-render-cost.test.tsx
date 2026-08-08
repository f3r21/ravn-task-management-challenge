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
 * **Two counters, and they are not two independent checks — the second exists because
 * the first went blind once already.** Both are module mocks rather than counters
 * added to components, so they sit downstream of the boundary they measure: counting a
 * memoised component from the outside would count React's *attempts* to render it,
 * which `memo` does not change.
 *
 * - `TaskListView` counts **columns**, and it is the assertion that pins
 *   `memo(BoardColumn)`. Dropping the memo fails it with `expected 5 to be 0`.
 * - `Menu` counts **cards** — `TaskActionsMenu` is the only thing in the app that
 *   renders one (`grep -rn --include='*.tsx' '<Menu' src`), exactly one per task, in
 *   both views.
 *
 * **The closing `cards === 0` cannot fail while `columns === 0` holds, and that is
 * stated rather than dressed up as a second guarantee.** A memoised column never
 * re-runs, so the `useMemo` building its card props never recomputes; breaking that
 * inner memo on its own leaves this test green, which was checked rather than assumed.
 * The card counter earns its place on the *opening* assertion instead — `cards === 150`
 * is what proves the board actually mounted — and as the thing that would notice if the
 * boundary moved somewhere this file does not know about.
 *
 * Worth knowing if you sabotage this yourself: dropping `memo()` leaves the *card*
 * count at a perfect 0 anyway. The `actions` elements inside the memoised props array
 * stay referentially identical across the re-render, so React bails out of the menu
 * subtree specifically while the kit rebuilds all 150 cards around it. A card-only
 * instrument reports a flawless score for a board that is re-rendering completely.
 *
 * **The instrument used to be `Avatar` alone, and the board migration made it blind.**
 * Worth recording, because the failure was silent in the dangerous direction: the
 * board now renders `@ravn/ui-kit`'s `TaskCard`, which calls the kit's *internal*
 * `Avatar` rather than importing it from the barrel this file mocks. So the mock
 * stopped intercepting card avatars entirely and the opening count fell to zero —
 * caught only because that opening assertion exists. Had the test asserted just the
 * closing `=== 0`, a completely blind instrument would have reported a perfect score.
 * A mock of a package barrel only ever sees what the *app* imports through it, which
 * is also why neither counter can reach inside the kit's own card.
 *
 * The label filter on `Menu` is belt-and-braces, so that adding a menu elsewhere in
 * the app later cannot quietly pollute the card count.
 *
 * The opening assertions are what keep the closing ones from passing vacuously:
 * `cards === 150` and `columns === 5` prove the board really did mount before
 * anything was measured. Without them the test could go green having measured
 * nothing at all — which is not hypothetical here, it is precisely what the `Avatar`
 * instrument started doing.
 *
 * All four asserted numbers are re-derived by a green run, since the assertions *are*
 * the numbers:
 *
 *     npx vitest run src/features/board/board-render-cost.test.tsx
 *
 * The unmemoised figure is the one thing CI cannot assert, because asserting it would
 * mean keeping the code broken. Reproduce it by dropping the `memo()` wrapper in
 * `board-column.tsx` and running the same command: `expected 5 to be 0` on columns —
 * five columns rebuilding all 150 cards for one character.
 *
 * **The memo boundary moved** in app#31: it used to sit on each `TaskCard`, and the
 * kit's `TaskListView` builds its own cards from a props array and memoises none of
 * them, so the boundary is now the column. One boundary per column instead of one per
 * card, and it skips the column header too.
 *
 * There is deliberately no `console.log` reporting the counts: Vitest buffers
 * test-side console output and prints it only for failing tests, so on a green run
 * it would emit nothing and the figure would look sourced when it was not.
 */
const renders = vi.hoisted(() => ({ cards: 0, columns: 0 }))

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
    TaskListView: (props: ComponentProps<typeof actual.TaskListView>) => {
      renders.columns += 1
      return createElement(actual.TaskListView, props)
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
    // nothing must not look like measuring zero. One column per status, and one card
    // per task across all of them.
    expect(renders.cards).toBe(TASK_COUNT)
    expect(renders.columns).toBe(BOARD_STATUSES.length)

    // The board is up. Everything counted from here belongs to the keystroke.
    renders.cards = 0
    renders.columns = 0

    await user.type(
      await screen.findByRole('searchbox', { name: 'Search tasks' }, { timeout: 20_000 }),
      'a',
    )

    // Not one column re-renders, so the kit never rebuilds a card. The header does
    // re-render — it is the component that owns the input — but it renders neither a
    // `Menu` nor a `TaskListView`, so it cannot satisfy either of these on its own.
    expect(renders.columns).toBe(0)

    // And not one card. Implied by the line above rather than independent of it — see
    // the header — so this is a consistency check on the instrument, not a second
    // guarantee. It is the assertion that would catch the card counter going blind the
    // way the `Avatar` one did.
    expect(renders.cards).toBe(0)
  }, 30_000)
})
