import { memo, useMemo } from 'react'
import { TaskListView } from '@ravn/ui-kit'
import { TaskActionsMenu } from './task-card/task-actions-menu'
import { toKitCardProps } from './task-card/to-kit-props'
import { statusLabel } from './task-display'
import type { Status, Task } from './task-types'

interface BoardColumnProps {
  status: Status
  tasks: Task[]
  /** Injected so tests can pin "today" without faking the clock. */
  now?: Date
  className?: string
  onEditTask?: (task: Task) => void
  onDeleteTask?: (task: Task) => void
}

/**
 * "In Progress (03)" — zero-padded because the design is, and so the heading stops
 * reflowing every time a task moves in or out of the column.
 *
 * Exported because the list view's groups carry the same title, and two spellings of one
 * heading is exactly the drift `to-kit-props.ts` exists to prevent one level down.
 */
export function columnTitle(status: Status, count: number): string {
  return `${statusLabel(status)} (${String(count).padStart(2, '0')})`
}

const EMPTY_TITLE = 'No tasks here yet.'

/**
 * One status column of the board view. The list view is a single `TaskTable` for all five
 * statuses rather than five of anything — see `board-list-table.tsx` — so `Board` branches
 * and this component no longer takes a `view`.
 *
 * **This is the memo boundary for the board view, and that is a change worth knowing
 * about.** It used to sit on `TaskCard`, one per card. The board half now renders through
 * `@ravn/ui-kit`'s `TaskListView`, which builds its own `TaskCard`s from a `TaskCardProps[]`
 * and memoises none of them — so a per-card boundary is no longer reachable from here. A
 * boundary around the column does the same job and slightly more: the arrays below are
 * `useMemo`d, so a render where the tasks did not change skips the column entirely, header
 * and cards together.
 *
 * What it depends on is unchanged and just as easy to break: every prop must stay
 * referentially stable across a parent render. `onEditTask`/`onDeleteTask` are stabilised
 * in `board-page.tsx`, and the `task` objects keep their identity through React Query's
 * structural sharing. Hand this an inline arrow and nothing fails — the board stays
 * correct, it just stops being faster. `board-render-cost.test.tsx` is what notices, which
 * is why it is committed rather than run once.
 */
function BoardColumnImpl({
  status,
  tasks,
  now,
  className,
  onEditTask,
  onDeleteTask,
}: BoardColumnProps) {
  const title = columnTitle(status, tasks.length)

  // Resolved through a memo rather than inline, because `now ?? new Date()` written at the
  // top of the render would mint a new `Date` every time and defeat every memo below it.
  const resolvedNow = useMemo(() => now ?? new Date(), [now])

  const cards = useMemo(
    () =>
      tasks.map((task) =>
        toKitCardProps(task, resolvedNow, {
          actions: <TaskActionsMenu task={task} onEdit={onEditTask} onDelete={onDeleteTask} />,
          // One below the column header's `2`, so the board's outline nests. Both were
          // level 3 before the kit exposed this, which made a column header
          // indistinguishable from its own cards to `getAllByRole('heading', { level: 3 })`.
          headingLevel: 3,
        }),
      ),
    [tasks, resolvedNow, onEditTask, onDeleteTask],
  )

  return (
    <TaskListView
      title={title}
      // `label` is the kit's own opt-in `<section aria-label>`, so the app does not wrap
      // this in a landmark of its own — two nested landmarks with different names is
      // exactly what the kit's doc comment warns the prop exists to avoid. It has to be
      // `aria-label` rather than `aria-labelledby`: the header's heading carries an `id`
      // only when something passes `titleId`, and `TaskListView` does not forward one.
      label={title}
      headingLevel={2}
      tasks={cards}
      emptyTitle={EMPTY_TITLE}
      className={className}
    />
  )
}

export const BoardColumn = memo(BoardColumnImpl)
