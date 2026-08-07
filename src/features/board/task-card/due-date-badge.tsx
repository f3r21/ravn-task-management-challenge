import { dueDateTone, formatDueDate, type DueDateTone } from '@/lib/due-date'
import { AlarmIcon } from '@ravn/ui-kit'
import { Tag, type TagTone } from '@/ui/tag/tag'

interface DueDateBadgeProps {
  dueDate: Date
  /** Injected rather than read from the clock, so tests are not time-dependent. */
  now?: Date
}

/**
 * The three tiers, in the design system's own tone names.
 *
 * `normal` is the brief's "on time" green. It rendered as the neutral badge for a
 * while, on the reasoning that `iOS app` is already a green chip and a green badge
 * sitting directly above one reads as a relationship that is not there. The brief
 * asks for green outright, though, and hue is not the only thing separating the
 * two: the badge carries the alarm glyph, sits in its own row above the tag list,
 * and is the only chip on a card that is not a tag.
 *
 * Colour is decoration on top of the date in every tier — the badge always spells
 * the date out, and `overdue` says so in words below.
 */
const TONE_TO_TAG: Record<DueDateTone, TagTone> = {
  overdue: 'red',
  soon: 'amber',
  normal: 'green',
}

export function DueDateBadge({ dueDate, now = new Date() }: DueDateBadgeProps) {
  const tone = dueDateTone(dueDate, now)

  return (
    <Tag tone={TONE_TO_TAG[tone]} icon={<AlarmIcon className="size-6 shrink-0" />}>
      {/* The visible text says "Yesterday"; colour says "overdue". Colour alone
          is not information a screen reader or a colour-blind user receives, so
          the state is spelled out here and hidden from sighted layout. */}
      {formatDueDate(dueDate, now)}
      {tone === 'overdue' ? <span className="sr-only"> (overdue)</span> : null}
    </Tag>
  )
}
