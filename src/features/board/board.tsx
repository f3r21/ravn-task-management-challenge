import { TaskTable } from '@ravn/ui-kit'
import { BoardColumn } from './board-column'
import type { BoardView } from './board-toolbar'
import { statusLabel } from './task-display'
import { toKitTableRowProps } from './task-card/to-kit-props'
import { BOARD_STATUSES, type Status, type Task } from './task-types'

interface BoardProps {
  tasks: Task[]
  view: BoardView
  now?: Date
  onEditTask?: (task: Task) => void
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

export function Board({ tasks, view, now, onEditTask }: BoardProps) {
  // The adapter (`toKitCardProps`/`toKitTableRowProps`) takes a required `Date`,
  // not an optional one — it's meant to be a pure function with no hidden clock
  // read of its own, so `Board` resolves "now" once, here, for both branches.
  const effectiveNow = now ?? new Date()
  const grouped = groupByStatus(tasks)

  if (view === 'list') {
    /*
     * The list view is not the board stacked — see the grid branch's own comment
     * for why. The kit's `TaskTable` already groups by section internally (one
     * bordered `<table>` per group), so this is one component call for the whole
     * board, not one per status the way the grid branch's columns are.
     */
    return (
      <TaskTable
        groups={BOARD_STATUSES.map((status) => {
          const tasksInStatus = grouped.get(status) ?? []
          return {
            title: `${statusLabel(status)} (${String(tasksInStatus.length).padStart(2, '0')})`,
            rows: tasksInStatus.map((task, index) =>
              toKitTableRowProps(task, index + 1, effectiveNow, () => onEditTask?.(task)),
            ),
          }
        })}
      />
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
          now={effectiveNow}
          className="xl:w-87 xl:shrink-0"
          onEditTask={onEditTask}
        />
      ))}
    </div>
  )
}
