import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type TagTone = 'green' | 'amber' | 'blue' | 'red' | 'neutral'

interface TagProps {
  tone?: TagTone
  /** Rendered before the label, e.g. the alarm glyph on a due-date badge. */
  icon?: ReactNode
  children: ReactNode
  className?: string
}

/**
 * The chip shape the design uses for both task tags and the due-date badge:
 * accent text on the same accent at 10% opacity.
 *
 * The two are one component because they are one thing in Figma — the same `Tag`
 * component instance, differing only in colour and whether it carries an icon.
 * Splitting them here would mean two implementations drifting apart on padding.
 */
const TONE_CLASSES: Record<TagTone, string> = {
  green: 'bg-secondary-4/10 text-secondary-4',
  amber: 'bg-tertiary-4/10 text-tertiary-4',
  blue: 'bg-blue/10 text-blue',
  red: 'bg-danger/10 text-danger',
  neutral: 'bg-muted/10 text-main',
}

export function Tag({ tone = 'neutral', icon, children, className }: TagProps) {
  return (
    <span
      className={cn(
        'rounded-4 inline-flex items-center gap-2 px-4 py-1',
        // The design draws every chip on a single line. Without `nowrap` a
        // spelled-out date breaks across three lines in a narrow column and the
        // badge stops looking like a badge.
        'text-body-m font-semibold whitespace-nowrap uppercase',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
