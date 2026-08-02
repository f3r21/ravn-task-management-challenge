import { parseApiDate } from '@/lib/due-date'
import { Avatar } from '@/ui/avatar/avatar'
import { AttachmentIcon, CommentIcon, MenuDotsIcon, SubtaskIcon } from '@/ui/icons/icons'
import { Tag } from '@/ui/tag/tag'
import { pointsLabel, tagAccent, tagLabel } from '../task-display'
import type { Task } from '../task-types'
import { DueDateBadge } from './due-date-badge'

interface TaskCardProps {
  task: Task
  /** Injected so tests can pin "today" without faking the clock. */
  now?: Date
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
    <div className="text-text-primary flex items-center gap-4" aria-hidden="true">
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

export function TaskCard({ task, now }: TaskCardProps) {
  const dueDate = parseApiDate(task.dueDate)

  return (
    <article
      className="bg-surface-raised rounded-card flex flex-col gap-4 p-4"
      aria-labelledby={`task-${task.id}-name`}
    >
      <div className="flex h-8 items-center gap-2">
        <h3
          id={`task-${task.id}-name`}
          className="text-body-l min-w-0 flex-1 truncate font-semibold"
        >
          {task.name}
        </h3>
        <button
          type="button"
          aria-label={`Task options for ${task.name}`}
          className="text-text-secondary hover:text-text-primary shrink-0 transition-colors"
        >
          <MenuDotsIcon className="size-6" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-body-m font-semibold whitespace-nowrap">
          {pointsLabel(task.pointEstimate)}
        </span>
        {dueDate ? <DueDateBadge dueDate={dueDate} now={now} /> : null}
      </div>

      {task.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {task.tags.map((tag) => (
            <li key={tag}>
              <Tag tone={tagAccent(tag)}>{tagLabel(tag)}</Tag>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-center justify-between">
        <Avatar src={task.assignee?.avatar} name={task.assignee?.fullName} />
        <TaskCardMeta />
      </div>
    </article>
  )
}
