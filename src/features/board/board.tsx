import { BoardColumn } from './board-column'
import type { BoardView } from './board-toolbar'
import { BOARD_STATUSES, type Status, type Task } from './task-types'

interface BoardProps {
  tasks: Task[]
  view: BoardView
  now?: Date
}

/**
 * Groups tasks by status into the board's columns.
 *
 * Derived on every render rather than stored. A second copy of the same data,
 * kept in sync by an effect, is the classic way for a board to end up showing a
 * card in a column it no longer belongs to.
 */
function groupByStatus(tasks: Task[]): Map<Status, Task[]> {
  const grouped = new Map<Status, Task[]>(BOARD_STATUSES.map((status) => [status, []]))
  for (const task of tasks) {
    // A status outside the known set means the API grew a member this build does
    // not know about. Dropping the task silently would be worse than the column
    // simply not existing, so it is left out of the board rather than crashing it.
    grouped.get(task.status)?.push(task)
  }
  return grouped
}

export function Board({ tasks, view, now }: BoardProps) {
  const grouped = groupByStatus(tasks)

  if (view === 'list') {
    return (
      <div className="flex flex-col gap-8">
        {BOARD_STATUSES.map((status) => (
          <BoardColumn key={status} status={status} tasks={grouped.get(status) ?? []} now={now} />
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
        />
      ))}
    </div>
  )
}
