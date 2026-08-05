import { Item } from 'react-stately'
import { Menu } from '@ravn/ui-kit'
import { parseApiDate } from '@/lib/due-date'
import { cn } from '@/lib/cn'
import { Avatar } from '@/ui/avatar/avatar'
import { AttachmentIcon, CommentIcon, MenuDotsIcon, SubtaskIcon } from '@/ui/icons/icons'
import { Tag } from '@/ui/tag/tag'
import { pointsLabel, tagAccent, tagLabel } from '../task-display'
import type { Task } from '../task-types'
import { DueDateBadge } from './due-date-badge'

/**
 * `card` stacks the fields, which is what the design draws for a board column.
 * `row` lays them out along one line for the list view, where a column is as wide
 * as the page and a stacked card would just be a card with more whitespace.
 */
export type TaskCardLayout = 'card' | 'row'

interface TaskCardProps {
  task: Task
  /** Injected so tests can pin "today" without faking the clock. */
  now?: Date
  layout?: TaskCardLayout
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}

/**
 * The attachment / subtask / comment counters in the card footer.
 *
 * The schema has no fields behind these — no attachments, no subtasks, no
 * comments — so they are fixed. They are kept because the design has them and
 * the brief asks for the dashboard to match it; they are marked `aria-hidden`
 * because announcing counts that are not real would be worse than silence.
 */
function TaskCardMeta() {
  return (
    <div className="text-main flex items-center gap-4" aria-hidden="true">
      <AttachmentIcon className="size-4" />
      <span className="text-body-m flex items-center gap-1">
        5 <SubtaskIcon className="size-4" />
      </span>
      <span className="text-body-m flex items-center gap-1">
        3 <CommentIcon className="size-4" />
      </span>
    </div>
  )
}

export function TaskCard({ task, now, layout = 'card', onEdit, onDelete }: TaskCardProps) {
  const dueDate = parseApiDate(task.dueDate)
  const isRow = layout === 'row'

  // The same fields in both layouts; only the arrangement differs. Declared once
  // so the two cannot drift into showing different information — including the
  // options menu, which the list view would otherwise be missing entirely.
  const name = (
    <h3 id={`task-${task.id}-name`} className="text-body-l min-w-0 flex-1 truncate font-semibold">
      {task.name}
    </h3>
  )

  const points = (
    <span className="text-body-m font-semibold whitespace-nowrap">
      {pointsLabel(task.pointEstimate)}
    </span>
  )

  const date = dueDate ? <DueDateBadge dueDate={dueDate} now={now} /> : null

  const tags =
    task.tags.length > 0 ? (
      <ul className="flex flex-wrap gap-2">
        {task.tags.map((tag) => (
          <li key={tag}>
            <Tag tone={tagAccent(tag)}>{tagLabel(tag)}</Tag>
          </li>
        ))}
      </ul>
    ) : null

  const assignee = <Avatar src={task.assignee?.avatar} name={task.assignee?.fullName} />

  const options = (
    /* Every card carries one of these, so the accessible name has to say which task
       it belongs to — "options" alone is ambiguous the moment a screen-reader user
       lists the buttons on the page. */
    <Menu
      label={`Task options for ${task.name}`}
      triggerContent={<MenuDotsIcon className="size-6" />}
      triggerClassName="text-muted hover:text-main shrink-0 transition-colors"
      onAction={(key) => {
        // Deferred by a frame so the menu finishes closing first.
        //
        // React Aria records what to restore focus to when the dialog first
        // renders. Opening it straight from `onAction` puts that render in the same
        // commit that unmounts the menu item, so the recorded element is already
        // detached, gets discarded, and focus lands on `<body>` when the dialog
        // closes. Waiting lets the menu hand focus back to its own trigger, which
        // is then the element the dialog records — and returns to.
        requestAnimationFrame(() => {
          if (key === 'edit') {
            onEdit?.(task)
          }
          if (key === 'delete') {
            onDelete?.(task)
          }
        })
      }}
    >
      <Item key="edit">Edit</Item>
      {/* Deleting is destructive and is worth marking as such. The kit's `Menu`
          deliberately has no destructive-item flag — a `'delete'`-keyed special
          case is one app's key naming, not something a generic component should
          assume — so the colour is applied here, to the item's own children. It
          is decoration on top of the word "Delete", never the only signal: colour
          alone would not reach a screen reader, and the item's text already does.

          `textValue` is what typeahead and the accessible name are computed from.
          Plain-string children supply it implicitly; wrapping them in an element
          does not, and react-stately warns about exactly that.

          `text-danger-text`, not `text-danger`: the kit's `Menu` paints its surface
          `surface-overlay` and its focused item `neutral-4`, and danger-5 measures
          2.55:1 and 3.14:1 on those. danger-3 is 5.65:1 and 6.94:1. */}
      <Item key="delete" textValue="Delete">
        <span className="text-danger-text">Delete</span>
      </Item>
    </Menu>
  )

  if (isRow) {
    return (
      <article
        className="bg-surface-panel rounded-sm flex flex-wrap items-center gap-x-6 gap-y-3 p-4"
        aria-labelledby={`task-${task.id}-name`}
      >
        {/* The name takes the slack and truncates; everything after it keeps its
            natural width so the row reads as columns rather than reflowing. */}
        {name}
        <div className="flex shrink-0 items-center gap-6">
          {points}
          {date}
        </div>
        {tags}
        <div className="flex shrink-0 items-center gap-6">
          {assignee}
          <TaskCardMeta />
          {options}
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn('bg-surface-panel rounded-sm flex flex-col gap-4 p-4')}
      aria-labelledby={`task-${task.id}-name`}
    >
      <div className="flex h-8 items-center gap-2">
        {name}
        {options}
      </div>

      <div className="flex items-center justify-between gap-2">
        {points}
        {date}
      </div>

      {tags}

      <div className="flex items-center justify-between">
        {assignee}
        <TaskCardMeta />
      </div>
    </article>
  )
}
