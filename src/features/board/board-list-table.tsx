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

  return <TaskTable groups={groups} />
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
