import { cn } from '@/lib/cn'
import { statusLabel } from './task-display'
import type { Status, Task } from './task-types'
import { TaskCard } from './task-card/task-card'

interface BoardColumnProps {
  status: Status
  tasks: Task[]
  now?: Date
  className?: string
}

/**
 * One status column: a heading with its count, then the cards.
 *
 * The count is zero-padded to two digits — "In Progress (03)" — because the
 * design is, and because a fixed-width count stops the heading reflowing every
 * time a task moves in or out.
 */
export function BoardColumn({ status, tasks, now, className }: BoardColumnProps) {
  const label = statusLabel(status)
  const count = String(tasks.length).padStart(2, '0')

  return (
    <section
      aria-labelledby={`column-${status}`}
      className={cn('flex min-w-0 flex-col gap-4', className)}
    >
      <h2 id={`column-${status}`} className="text-body-l flex h-8 items-center font-semibold">
        {label} ({count})
      </h2>

      {tasks.length === 0 ? (
        <p className="text-text-secondary text-body-m">No tasks here yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} now={now} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
