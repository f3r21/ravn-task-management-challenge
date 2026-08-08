import {
  AlarmIcon,
  Avatar,
  DUE_DATE_URGENCY_COLOR,
  Tag,
  type TaskTableRowProps,
} from '@ravn/ui-kit'
import { TAG_TEXT } from '../task-display'
import type { Task } from '../task-types'
import { TaskActionsMenu } from './task-actions-menu'

/**
 * One task as a row, for the list view — and the one board component the kit could not
 * take over.
 *
 * **Why this is still here.** `TaskTableRow` shipped everything else this migration needed
 * (`isSelectable`, `headingLevel`), but it has **no actions slot** — five fixed cells and
 * no `ReactNode` anywhere in its props, verified against the `v0.5.3` source with
 * `TaskCard`'s own `actions?: React.ReactNode` as the positive control. Rendering the list
 * view through it would silently drop Edit and Delete from every row, which is a
 * functional regression rather than a styling one. `TaskTable` also hardcodes its group
 * header as `<h3>`, which would put a skipped level between this page's `<h1>` and its
 * tasks. Both are filed as **ravn-ui-kit#95**; the standing rule is that a migration
 * blocked on a kit gap stops rather than regressing the app.
 *
 * **What it does about it.** This takes the kit's own `TaskTableRowProps` rather than a
 * shape of its own, so `to-kit-props.ts` already emits exactly what the real component
 * wants and swapping this out once #95 lands is a one-line change in `board-column.tsx`,
 * not another translation layer. The props it cannot honour — `isSelectable`, `index` —
 * are named below rather than dropped silently.
 *
 * It also still spells the overdue state out (see `dueDate` below), which the kit's own
 * renderers do not. That is **ravn-ui-kit#92**, and until it lands the board and this row
 * genuinely differ on that one point — the board card cannot say it, and there is no
 * reason to make this row stop.
 */
type TaskRowProps = Pick<
  TaskTableRowProps,
  'title' | 'dueDate' | 'dueDateUrgency' | 'tags' | 'assigneeName'
> & {
  /**
   * Required here although the kit types it optional. `pointValue` maps a
   * `PointEstimate` — which every task has — onto a number, so there is no path through
   * this app that omits it, and an `!== undefined` guard would be a branch no test could
   * ever reach. Narrowing an optional prop is a widening of what this component accepts
   * from the kit's own shape, so it does not affect the swap in `board-column.tsx`.
   */
  estimationPoints: NonNullable<TaskTableRowProps['estimationPoints']>
  assigneeAvatar?: TaskTableRowProps['assigneeAvatar']
  /** Whether the due date has passed, so the row can say so rather than only colour it. */
  isOverdue: boolean
  /** Only for the options menu's accessible name and its callbacks. */
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}

function TaskRowImpl({
  title,
  estimationPoints,
  dueDate,
  dueDateUrgency = 'normal',
  tags = [],
  assigneeName,
  assigneeAvatar,
  isOverdue,
  task,
  onEdit,
  onDelete,
}: TaskRowProps) {
  const titleId = `task-${task.id}-name`

  return (
    <article
      className="bg-surface-panel rounded-sm flex flex-wrap items-center gap-x-6 gap-y-3 p-4"
      aria-labelledby={titleId}
    >
      {/* The name takes the slack and truncates; everything after it keeps its
          natural width so the row reads as columns rather than reflowing. */}
      <h3 id={titleId} className="text-body-l min-w-0 flex-1 truncate font-semibold">
        {title}
      </h3>

      <div className="flex shrink-0 items-center gap-6">
        <span className="text-body-m font-semibold whitespace-nowrap">
          {estimationPoints} {estimationPoints === 1 ? 'Point' : 'Points'}
        </span>

        {dueDate ? (
          // `DUE_DATE_URGENCY_COLOR` is the kit's own map, imported rather than
          // re-declared: the app used to keep a second copy of it, which is exactly the
          // kind of table that agrees on the day it is written and drifts afterwards.
          <Tag
            variant={DUE_DATE_URGENCY_COLOR[dueDateUrgency]}
            icon={<AlarmIcon className="size-6 shrink-0" />}
            className={TAG_TEXT}
          >
            {/* The visible text says "Yesterday"; colour says "overdue". Colour alone is
                not information a screen reader receives, so the state is spelled out and
                hidden from sighted layout. The kit's `TaskCard` and `DueDateCell` do not
                do this — ravn-ui-kit#92 — which is why the board card currently cannot. */}
            {dueDate}
            {isOverdue ? <span className="sr-only"> (overdue)</span> : null}
          </Tag>
        ) : null}
      </div>

      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag.label}>
              <Tag variant={tag.variant} className={TAG_TEXT}>
                {tag.label}
              </Tag>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex shrink-0 items-center gap-6">
        {/* Explicit, because the defaults invert: this app's rows draw the 32px avatar
            and the kit's `Avatar` defaults to 40px (`md`). Omitting it here is
            type-correct, lint-clean and silently grows every row's avatar — and it is
            what `board-render-cost.test.tsx` splits card renders from header renders on. */}
        <Avatar size="sm" src={assigneeAvatar} name={assigneeName} />
        <TaskActionsMenu task={task} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </article>
  )
}

/**
 * Not memoised, deliberately — the memo boundary for both views is one level up.
 *
 * A `memo` here could never hold: `tags` is an array this row is handed fresh on every
 * render of its column, so the shallow prop comparison would fail every time and the memo
 * would be pure cost. `BoardColumn` is the boundary instead, and it holds because the
 * arrays it builds are `useMemo`d — so a keystroke that leaves the tasks unchanged skips
 * the whole column, rows included. That is the same mechanism the board half gets from
 * memoising around the kit's `TaskListView`, which is not memoised either.
 * `board-render-cost.test.tsx` is what notices if that stops being true.
 */
export const TaskRow = TaskRowImpl
