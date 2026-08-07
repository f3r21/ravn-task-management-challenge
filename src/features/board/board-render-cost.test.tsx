import { createElement, type ComponentProps } from 'react'
import { graphql, HttpResponse } from 'msw'
import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { server } from '@/mocks/server'
import { makeTask } from '@/mocks/task-fixtures'
import { renderApp, userEvent } from '@/test/test-utils'
import type * as AvatarModule from '@/ui/avatar/avatar'
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
 * `TaskCard` renders exactly one `Avatar`, unconditionally — it passes
 * `task.assignee?.avatar`, so an unassigned task still gets the initials fallback —
 * and `AppHeader` renders one more. That is what makes the count `cards + 1`, and
 * it would drift silently if a second avatar appeared on the card or that one
 * became conditional.
 *
 * Both figures this work quotes are re-derived from this one file. The *after* is
 * a green run, since the assertion is the number:
 *
 *     npx vitest run src/features/board/board-render-cost.test.tsx
 *
 * The *before* needs the fix taken back out — drop the `memo()` wrapper in
 * `task-card.tsx` and run the same command, which fails with `expected 151 to be
 * 1`. There is deliberately no `console.log` here reporting the count: Vitest
 * buffers test-side console output and prints it only for failing tests, so on a
 * green run it would emit nothing and the figure would look sourced when it was
 * not.
 */
const renders = vi.hoisted(() => ({ avatars: 0 }))

vi.mock('@/ui/avatar/avatar', async (importOriginal) => {
  const actual = await importOriginal<typeof AvatarModule>()
  return {
    ...actual,
    Avatar: (props: ComponentProps<typeof actual.Avatar>) => {
      renders.avatars += 1
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

    // The board is up. Everything counted from here belongs to the keystroke.
    renders.avatars = 0

    await user.type(
      await screen.findByRole('searchbox', { name: 'Search tasks' }, { timeout: 20_000 }),
      'a',
    )

    // The header's own avatar re-renders — it is inside the component that owns the
    // input — and nothing else should.
    expect(renders.avatars).toBe(1)
  }, 30_000)
})
