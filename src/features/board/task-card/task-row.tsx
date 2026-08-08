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
 * **Why this existed.** At `v0.5.3` `TaskTableRow` had shipped everything else this
 * migration needed (`isSelectable`, `headingLevel`) but had **no actions slot** — five
 * fixed cells and no `ReactNode` anywhere in its props, verified against the source with
 * `TaskCard`'s own `actions?: React.ReactNode` as the positive control. Rendering the list
 * view through it would have silently dropped Edit and Delete from every row, a functional
 * regression rather than a styling one, and `TaskTable` hardcoded its group header as
 * `<h3>`, putting a skipped level between this page's `<h1>` and its tasks. Both were filed
 * as **ravn-ui-kit#95**, because the standing rule is that a migration blocked on a kit gap
 * stops rather than regressing the app.
 *
 * **#95 shipped in `v0.7.0` and this app pins it, so the block is gone.** What remains is
 * the migration itself. Do not read this file as evidence that the list view cannot move —
 * check the pinned tag rather than this paragraph, since a comment asserting a block
 * outlives the block by exactly as long as nobody rereads it:
 *
 * ```bash
 * grep ui-kit package.json     # then, against that tag:
 * gh api "repos/f3r21/ravn-ui-kit/contents/src/components/card/task-table.tsx?ref=<tag>" \
 *   --jq .content | base64 -d | grep -c 'actions?: React.ReactNode'    # must be 2
 * ```
 *
 * Two rather than non-zero: the group-header slot masks the row slot at 1.
 *
 * **What it does meanwhile.** This takes the kit's own `TaskTableRowProps` rather than a
 * shape of its own, so `to-kit-props.ts` already emits exactly what the real component
 * wants. The props it cannot honour — `isSelectable`, `index` — are named below rather than
 * dropped silently.
 *
 * It spells the overdue state out itself (see `dueDate` below). That used to be a point on
 * which this row and the board genuinely differed — the kit conveyed urgency by colour
 * alone, which was **ravn-ui-kit#92** — and `v0.6.0` closed it, so the two agree again.
 * The wording here was moved onto the kit's `, overdue` ahead of that release precisely so
 * the bump would not change what a screen reader says.
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
                hidden from sighted layout.

                Phrased `, overdue` rather than the ` (overdue)` this app used to emit,
                which is the string `@ravn/ui-kit` emits for the same state since
                `v0.6.0` (ravn-ui-kit#92). Matching it was done *before* that release
                rather than after, so the bump changed nothing a screen reader hears and
                the two views never stated one fact two ways. Spoken punctuation, not
                visible: the comma paces the announcement, which is the kit's own idiom
                ("Notifications, 3 unread").

                Hand-written only until this row becomes the kit's own `TaskTableRow`,
                which announces the same state via `dueDateUrgencyLabel`. That is now a
                migration outstanding rather than a gap — ravn-ui-kit#95 shipped in
                `v0.7.0`. */}
            {dueDate}
            {isOverdue ? <span className="sr-only">, overdue</span> : null}
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
