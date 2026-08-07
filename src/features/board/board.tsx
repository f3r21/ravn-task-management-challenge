import { useMemo } from 'react'
import { BoardColumn } from './board-column'
import type { BoardView } from './board-toolbar'
import { BOARD_STATUSES, type Status, type Task } from './task-types'

interface BoardProps {
  tasks: Task[]
  view: BoardView
  now?: Date
  onEditTask?: (task: Task) => void
  onDeleteTask?: (task: Task) => void
}

/**
 * Groups tasks by status into the board's columns.
 *
 * Derived from `tasks` rather than stored. A second copy of the same data, kept
 * in sync by an effect, is the classic way for a board to end up showing a card
 * in a column it no longer belongs to.
 */
function groupByStatus(tasks: Task[]): Map<Status, Task[]> {
  const grouped = new Map<Status, Task[]>(BOARD_STATUSES.map((status) => [status, []]))
  for (const task of tasks) {
    // A status outside the known set means the API grew a member this build does not
    // know about. Crashing the board would be worse than one task not appearing, so
    // an unknown status is dropped — deliberately, and pinned by a test.
    grouped.get(task.status)?.push(task)
  }

  // Ordered by `position`, which is what the field is for. The query has always
  // selected it and nothing read it, so columns rendered in whatever order the
  // API happened to return — an order the user cannot influence and that can
  // change between requests. Sorting a copy, because `Array.prototype.sort`
  // mutates and these arrays are handed straight to the columns.
  for (const [status, inColumn] of grouped) {
    grouped.set(
      status,
      [...inColumn].sort((a, b) => a.position - b.position),
    )
  }
  return grouped
}

export function Board({ tasks, view, now, onEditTask, onDeleteTask }: BoardProps) {
  // Memoised to skip the regrouping — a `Map`, five arrays and five `sort()`s —
  // on renders where the tasks did not change, which is every keystroke in the
  // header's search box.
  //
  // That is the whole of what it buys, and specifically it is *not* what makes
  // `memo(TaskCard)` downstream hold: `BoardColumn` is unmemoised, so the column
  // arrays are re-read on every render regardless, and a card's props carry the
  // individual `task` object rather than the array containing it. Those objects
  // keep their identity through React Query's structural sharing.
  //
  // `tasks` is stable across a keystroke for a slightly roundabout reason worth
  // writing down: `queryInput` *is* rebuilt on every keystroke — `filters.tags`
  // is a fresh array each time `filters` recomputes — but React Query hashes the
  // key structurally, so the hash is unchanged, no refetch is triggered, and the
  // same array comes back out of the same cache entry.
  const grouped = useMemo(() => groupByStatus(tasks), [tasks])

  if (view === 'list') {
    return (
      /*
       * The list view is not the board stacked — that is what the board already
       * does at narrow widths, so a switcher between the two would do nothing on a
       * phone. Each status becomes a full-width section and each task a single row,
       * so the fields line up down the page and far more tasks fit on screen.
       */
      <div className="flex flex-col gap-8">
        {BOARD_STATUSES.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            tasks={grouped.get(status) ?? []}
            now={now}
            itemLayout="row"
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    )
  }

  return (
    /*
     * Mobile first: one column, then two, then the board proper.
     *
     * At the widest breakpoint the columns are pinned to the 348px the design
     * draws them at and the row scrolls sideways, rather than being divided into
     * five equal shares of the viewport. The brief asks for five statuses where
     * the mockup shows three, and five equal shares of 1440px leaves each card
     * around 200px — narrow enough that the points label, the date badge and the
     * tag row all start wrapping and the card stops resembling the design at
     * all. Sideways scrolling is also what a board is expected to do.
     */
    <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 xl:flex xl:flex-row xl:overflow-x-auto xl:pb-2">
      {BOARD_STATUSES.map((status) => (
        <BoardColumn
          key={status}
          status={status}
          tasks={grouped.get(status) ?? []}
          now={now}
          className="xl:w-87 xl:shrink-0"
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  )
}
