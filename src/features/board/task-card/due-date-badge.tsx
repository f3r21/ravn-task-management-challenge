import { dueDateTone, formatDueDate, type DueDateTone } from '@/lib/due-date'
import { AlarmIcon } from '@/ui/icons/icons'
import { Tag, type TagTone } from '@/ui/tag/tag'

interface DueDateBadgeProps {
  dueDate: Date
  /** Injected rather than read from the clock, so tests are not time-dependent. */
  now?: Date
}

const TONE_TO_TAG: Record<DueDateTone, TagTone> = {
  overdue: 'red',
  soon: 'amber',
  normal: 'neutral',
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
