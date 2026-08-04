import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  title: string
  description?: string
  /** A way out of the empty state — clearing a filter, creating the first task. */
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
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
