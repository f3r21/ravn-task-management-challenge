import { memo, useMemo } from 'react'
import { TaskTable, type TaskTableGroup } from '@ravn/ui-kit'
import { TaskActionsMenu } from './task-card/task-actions-menu'
import { toKitTableRowProps } from './task-card/to-kit-props'
import { columnTitle } from './board-column'
import { BOARD_STATUSES, type Status, type Task } from './task-types'

interface BoardListTableProps {
  grouped: Map<Status, Task[]>
  /** Injected so tests can pin "today" without faking the clock. */
  now?: Date
  onEditTask?: (task: Task) => void
  onDeleteTask?: (task: Task) => void
}

/**
 * The list view: one `@ravn/ui-kit` `TaskTable` for the whole board.
 *
 * **One component for five statuses, where the board half is one per column.** That is the
 * kit's shape rather than a choice here — `TaskTable` takes `groups` and renders the shared
 * column-header row once above all of them, which is what the design draws and what a
 * per-group component could not produce. So `Board` branches on the view and this is the
 * whole list side of it.
 *
 * **It replaces an app-owned row that existed only because the kit could not carry it.**
 * `TaskTableRow` had no actions slot until `ravn-ui-kit#95`, so rendering the list view
 * through it would have dropped Edit and Delete from every row — a functional regression,
 * which is why the migration stopped rather than shipping. `v0.7.0` added the slot and
 * `TaskTableGroup.headingLevel`; `task-row.tsx` and its hand-written markup are gone.
 *
 * Every status is passed even when it has no tasks, so the list view keeps the board's
 * promise that a status is visible whether or not anything is in it. `TaskTable`'s own
 * `emptyTitle` covers only the case where `groups` itself is empty, which cannot happen
 * here — `BoardPage` renders its own empty state instead of a board when nothing loaded.
 */
function BoardListTableImpl({ grouped, now, onEditTask, onDeleteTask }: BoardListTableProps) {
  // Resolved through a memo rather than inline, because `now ?? new Date()` at the top of
  // the render would mint a new `Date` every time and defeat the memo below it.
  const resolvedNow = useMemo(() => now ?? new Date(), [now])

  const groups = useMemo<TaskTableGroup[]>(
    () =>
      BOARD_STATUSES.map((status) => {
        const tasks = grouped.get(status) ?? []
        return {
          title: columnTitle(status, tasks.length),
          // `2` here and `3` on each row, so the list view's outline nests the same way the
          // board's does under the page's `<h1>`. Hardcoded `<h3>` before `#95`, which put a
          // skipped level between the page heading and its tasks.
          headingLevel: 2,
          rows: tasks.map((task, index) =>
            toKitTableRowProps(task, resolvedNow, {
              // 1-based and restarting per group, which is what the design draws — the kit
              // zero-pads it for display.
              index: index + 1,
              headingLevel: 3,
              actions: <TaskActionsMenu task={task} onEdit={onEditTask} onDelete={onDeleteTask} />,
            }),
          ),
        }
      }),
    [grouped, resolvedNow, onEditTask, onDeleteTask],
  )

  // `contain-paint` is the list view's half of what `xl:contain-paint` does for the board,
  // and it is load-bearing for the same non-obvious reason — see `board.tsx`'s `GRID_WRAPPER`
  // for the long version.
  //
  // `TaskTable`'s root is already a correct scroll container: the design pins the five
  // columns to 1108px total, and the kit gives that root `w-full overflow-x-auto` so the
  // table scrolls inside itself on a narrow screen. Chrome nonetheless added those 1108px to
  // the *document's* scrollable area, so the whole page scrolled sideways — 667px at 375,
  // 554 at 768, 298 at 1024, 42 at 1280 — sliding the sidebar and the header off screen. The
  // board had the identical defect and `#142` established that ordinary clipping will not
  // touch it: measured there, `overflow-x: clip`/`hidden` on the shell, on `#root`, on `main`
  // and on the wrapper all failed, and paint containment was the only thing that worked.
  // Confirmed the same shape here before applying it — every ancestor of the scroll container
  // reports `scrollWidth === clientWidth` while the document overflows by 667, so there is
  // nothing out there for a clip to catch.
  //
  // It goes on the scroll container rather than a wrapper around it, which is why this is a
  // `className` and not a new `<div>`: containment on the element that already scrolls cannot
  // hide anything, because everything it clips is reachable by scrolling it. Unprefixed, since
  // unlike the board this overflows from 375px up.
  //
  // Deliberately not pushed into the kit, and the reason is *not* the obvious one. "It would
  // clip an overlay a consumer did not portal" is wrong: that root already computes
  // `overflow-y: auto` — CSS Overflow 3 forces a `visible` sibling of a non-`visible` value
  // to `auto` — so it clips such an overlay already and paint containment adds nothing to
  // that hazard. Measured on the root: `{overflowX: 'auto', overflowY: 'auto'}`.
  //
  // What containment does add is that it becomes a containing block for `position: fixed`
  // descendants and a new stacking context, and a fixed-position inline overlay is exactly
  // the strategy that escapes the existing clip today. Measured: a `position: fixed; top: 0;
  // left: 0` element placed inside this root lands at the root's own origin rather than the
  // viewport's, against a control copy on `document.body` that lands at `0, 0`. So shipping
  // this in the kit would silently relocate a working overlay in some other consumer. Here
  // it is safe because the app knows this page portals its overlays, which is knowledge the
  // kit does not have — page-level overflow is the page's business, and that is where the
  // board keeps it too.
  return <TaskTable groups={groups} className="contain-paint" />
}

/**
 * Memoised for the same reason `BoardColumn` is: the header's search box writes to the URL
 * on every keystroke, so the whole matched route re-renders while the tasks are unchanged.
 * The `useMemo` above only holds while every prop stays referentially stable across that
 * render — `onEditTask`/`onDeleteTask` are stabilised in `board-page.tsx`, and `grouped`
 * comes from a `useMemo` in `board.tsx`. `board-render-cost.test.tsx` is what notices if
 * that stops being true, and it measures the board half; this side is the same mechanism.
 */
export const BoardListTable = memo(BoardListTableImpl)
