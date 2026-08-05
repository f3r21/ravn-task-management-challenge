import { TaskListView } from '@ravn/ui-kit'
import { cn } from '@/lib/cn'
import { statusLabel } from './task-display'
import { toKitCardProps } from './task-card/to-kit-props'
import type { Status, Task } from './task-types'

interface BoardColumnProps {
  status: Status
  tasks: Task[]
  now: Date
  className?: string
  onEditTask?: (task: Task) => void
}

/**
 * One status column, wrapped in a landmark the kit's `TaskListView` doesn't
 * provide on its own (it renders a plain `<div>` with no `section`/region role) —
 * `aria-label` rather than `aria-labelledby`, since the kit renders its own `<h3>`
 * internally with no `id` this component can point at.
 */
export function BoardColumn({ status, tasks, now, className, onEditTask }: BoardColumnProps) {
  const title = `${statusLabel(status)} (${String(tasks.length).padStart(2, '0')})`

  return (
    <section aria-label={title} className={cn('min-w-0', className)}>
      <TaskListView
        title={title}
        tasks={tasks.map((task) => toKitCardProps(task, now, () => onEditTask?.(task)))}
      />
    </section>
  )
}
