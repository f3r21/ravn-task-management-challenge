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
  green: 'bg-accent-green/10 text-accent-green',
  amber: 'bg-accent-amber/10 text-accent-amber',
  blue: 'bg-accent-blue/10 text-accent-blue',
  red: 'bg-danger/10 text-danger',
  neutral: 'bg-text-secondary/10 text-text-primary',
}

export function Tag({ tone = 'neutral', icon, children, className }: TagProps) {
  return (
    <span
      className={cn(
        'rounded-pill inline-flex items-center gap-2 px-4 py-1',
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
