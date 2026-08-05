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
 * Deliberately not a live region. It used to carry `role="status"`, on the reasoning
 * that it appears in response to something the user just did — but a live region
 * announces *changes* to its contents, and this mounts with its text already inside,
 * so it announced nothing. The board's own status region, which outlives every one of
 * these states, is what reports "no tasks to show".
 *
 * It stays a labelled group so it is still a thing a screen-reader user can find and
 * step into, rather than three loose strings.
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
      role="group"
      aria-label={label}
      className={cn(
        'border-muted/20 rounded-sm flex flex-col items-center gap-2',
        'border border-dashed px-6 py-10 text-center',
        className,
      )}
    >
      <p className="text-body-m font-semibold">{title}</p>
      {description ? <p className="text-muted text-body-m">{description}</p> : null}
      {action}
    </div>
  )
}
