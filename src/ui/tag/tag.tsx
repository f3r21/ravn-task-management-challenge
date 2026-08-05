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
 * the accent at 10% opacity as the fill, with a label that clears WCAG AA on it.
 *
 * The two are one component because they are one thing in Figma — the same `Tag`
 * component instance, differing only in colour and whether it carries an icon.
 * Splitting them here would mean two implementations drifting apart on padding.
 *
 * **The label is not the fill colour, and that is deliberate for three of the five
 * tones.** Figma paints both from one swatch — `bg-X/10 text-X` — which cannot
 * clear 4.5:1, because a 10% tint of a colour is never far from that colour. The
 * fills below are all exactly as drawn; only the labels moved, and only where a
 * measurement forced it.
 *
 * This is `@ravn/ui-kit`'s decision, applied here so the two agree. The kit's own
 * `Tag` took it after an axe pass over its built Storybook found the same defect
 * across 30 renders; see its `tag.tsx` for the full reasoning and
 * `src/styles/contrast.test.ts` there for ratios computed from the tokens. Phase 2
 * of the migration replaces this file with the kit's `Tag` outright — this is the
 * stopgap for whichever ships first, not a second decision.
 */
const TONE_CLASSES: Record<TagTone, string> = {
  // `secondary-2`, not `secondary-4`: on its own tint the fill colour measures
  // 4.44:1 over a card and 3.66:1 over a modal — the near miss that makes the case
  // for computing these rather than eyeballing them. `secondary-2` is 6.67:1 and
  // 5.50:1 on those two.
  green: 'bg-secondary-4/10 text-secondary-2',
  // Left as drawn: `tertiary-4` already clears AA on its own tint (5.74:1 over a
  // card, 4.73:1 over a modal). Deviating further than the measurement forces
  // would be repainting the design for its own sake.
  amber: 'bg-tertiary-4/10 text-tertiary-4',
  // The tone the palette cannot serve on its own terms. `--color-blue` is a
  // standalone accent with no ramp — there is no lighter blue to step to — and on
  // its own tint it is 2.14:1 over a card and 1.77:1 over a modal, the worst
  // pairing in either repo. So the label goes white (12.53:1 / 10.38:1) and the
  // blue tint alone carries the tone. Inventing a lighter blue was considered and
  // rejected: no value in this system is invented or approximated.
  blue: 'bg-blue/10 text-main',
  // `red` is the overdue badge, and note it is the **danger** ramp here where the
  // kit's `red` is `primary-4` — a real difference to settle when Phase 2 swaps
  // this file out. `danger-5` on its own 10% tint measures 2.94:1 over a card and
  // 2.44:1 over a modal; `--color-danger-text` (danger-3) is 6.51:1 and 5.40:1.
  red: 'bg-danger/10 text-danger-text',
  // Already white on a grey tint, and already clear: 11.54:1 / 9.52:1.
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
