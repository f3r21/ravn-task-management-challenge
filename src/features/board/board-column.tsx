import { memo, useMemo } from 'react'
import { TaskListView } from '@ravn/ui-kit'
import { TaskActionsMenu } from './task-card/task-actions-menu'
import { TaskRow } from './task-card/task-row'
import { toKitCardProps, toKitTableRowProps } from './task-card/to-kit-props'
import { statusLabel } from './task-display'
import type { BoardView } from './board-toolbar'
import type { Status, Task } from './task-types'

interface BoardColumnProps {
  status: Status
  tasks: Task[]
  view: BoardView
  /** Injected so tests can pin "today" without faking the clock. */
  now?: Date
  className?: string
  onEditTask?: (task: Task) => void
  onDeleteTask?: (task: Task) => void
}

/** "In Progress (03)" — zero-padded because the design is, and so the heading stops
 *  reflowing every time a task moves in or out of the column. */
function columnTitle(status: Status, count: number): string {
  return `${statusLabel(status)} (${String(count).padStart(2, '0')})`
}

const EMPTY_TITLE = 'No tasks here yet.'

/**
 * One status column, in whichever view the board is showing.
 *
 * **This is the memo boundary for the whole board, and that is a change worth knowing
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
  view,
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

  if (view === 'grid') {
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

  return (
    <BoardListSection
      status={status}
      title={title}
      tasks={tasks}
      now={resolvedNow}
      onEditTask={onEditTask}
      onDeleteTask={onDeleteTask}
    />
  )
}

export const BoardColumn = memo(BoardColumnImpl)

interface BoardListSectionProps {
  status: Status
  title: string
  tasks: Task[]
  now: Date
  onEditTask?: (task: Task) => void
  onDeleteTask?: (task: Task) => void
}

/**
 * The list view's own column, which the kit could not take over until `v0.7.0` — see
 * `task-row.tsx`. `TaskTableRow` had no actions slot, so rendering through it would have
 * dropped Edit and Delete from every row; ravn-ui-kit#95 added the slot and a
 * `TaskTableGroup.headingLevel`, and this app now pins a tag containing both.
 *
 * **So this is pending rather than blocked**, and the distinction is the whole reason the
 * comment says which. It is driven by `toKitTableRowProps`, the same adapter the real
 * component takes, so the two views cannot show different information and the swap is a
 * change here rather than another translation layer.
 */
function BoardListSection({
  status,
  title,
  tasks,
  now,
  onEditTask,
  onDeleteTask,
}: BoardListSectionProps) {
  const rows = useMemo(
    () =>
      tasks.map((task, index) => ({
        task,
        // 1-based: the kit's `index` is a display position, which it zero-pads itself.
        props: toKitTableRowProps(task, now, { index: index + 1 }),
      })),
    [tasks, now],
  )

  return (
    <section aria-labelledby={`column-${status}`} className="flex min-w-0 flex-col gap-4">
      <h2 id={`column-${status}`} className="text-body-l flex h-8 items-center font-semibold">
        {title}
      </h2>

      {rows.length === 0 ? (
        <p className="text-muted text-body-m">{EMPTY_TITLE}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map(({ task, props }) => (
            <li key={task.id}>
              <TaskRow
                {...props}
                isOverdue={props.dueDateUrgency === 'overdue'}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
