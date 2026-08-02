import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  title: string
  description?: string
  /** A way out of the empty state — clearing a filter, creating the first task. */
  action?: ReactNode
  /** Names the region for assistive tech. */
  label?: string
  className?: string
}

/**
 * What fills the space where content would be.
 *
 * `role="status"` because this most often appears in response to something the
 * user just did — narrowing a filter until nothing matched. Without a live
 * region the board simply goes quiet: sighted users see the message, everyone
 * else gets silence and an empty page.
 */
export function EmptyState({
  title,
  description,
  action,
  label = 'No results',
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        'border-text-secondary/20 rounded-card flex flex-col items-center gap-2',
        'border border-dashed px-6 py-10 text-center',
        className,
      )}
    >
      <p className="text-body-m font-semibold">{title}</p>
      {description ? <p className="text-text-secondary text-body-m">{description}</p> : null}
      {action}
    </div>
  )
}
