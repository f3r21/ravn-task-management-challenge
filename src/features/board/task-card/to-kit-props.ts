import type { TaskCardProps, TaskTableRowProps } from '@ravn/ui-kit'
import { dueDateTone, formatDueDate, parseApiDate, type DueDateTone } from '@/lib/due-date'
import { pointValue, tagAccent, tagLabel, type TagAccent } from '../task-display'
import type { Task } from '../task-types'

type KitTagVariant = 'primary' | 'secondary' | 'tertiary' | 'neutral' | 'blue'
type KitUrgency = 'normal' | 'warning' | 'overdue'

/**
 * The kit's own 5 tag variants, read off `TaskCard`'s Figma doc comment
 * ("Type=General/Green/Blue/Yellow/Red") and confirmed against its
 * `dueDateUrgency`→`Tag`-variant map (`overdue`→`primary`, `warning`→`tertiary`):
 * neutral=General, secondary=Green, blue=Blue, tertiary=Yellow, primary=Red.
 * Defined once and reused by both target shapes below, per the migration prompt's
 * own instruction not to duplicate this mapping per call site.
 */
const TAG_TO_KIT_VARIANT: Record<TagAccent, KitTagVariant> = {
  green: 'secondary',
  amber: 'tertiary',
  blue: 'blue',
  red: 'primary',
  neutral: 'neutral',
}

const TONE_TO_KIT_URGENCY: Record<DueDateTone, KitUrgency> = {
  overdue: 'overdue',
  soon: 'warning',
  normal: 'normal',
}

function kitTags(task: Task): { label: string; variant: KitTagVariant }[] {
  return task.tags.map((tag) => ({
    label: tagLabel(tag),
    variant: TAG_TO_KIT_VARIANT[tagAccent(tag)],
  }))
}

function dueDateInfo(task: Task, now: Date): { text: string; urgency: KitUrgency } | undefined {
  const dueDate = parseApiDate(task.dueDate)
  if (!dueDate) {
    return undefined
  }
  return {
    text: formatDueDate(dueDate, now),
    urgency: TONE_TO_KIT_URGENCY[dueDateTone(dueDate, now)],
  }
}

export function toKitCardProps(task: Task, now: Date, onClick?: () => void): TaskCardProps {
  const due = dueDateInfo(task, now)
  return {
    title: task.name,
    points: pointValue(task.pointEstimate),
    dueDateText: due?.text,
    dueDateUrgency: due?.urgency,
    // `TaskCardProps['tags'][number]['variant']` is missing `'blue'` relative to the
    // kit's own `Tag` component and `TaskTableRowProps` — a type-only gap, verified
    // against the kit's bundled implementation (forwards the value as-is to the real
    // `Tag`). See UI_KIT_MIGRATION_PLAN.md's Phase 2 gap list. One cast, here only.
    tags: kitTags(task) as TaskCardProps['tags'],
    assigneeName: task.assignee?.fullName,
    assigneeAvatar: task.assignee?.avatar ?? undefined,
    onClick,
  }
}

export function toKitTableRowProps(
  task: Task,
  index: number,
  now: Date,
  onClick?: () => void,
): TaskTableRowProps {
  const due = dueDateInfo(task, now)
  return {
    index,
    title: task.name,
    tags: kitTags(task),
    estimationPoints: pointValue(task.pointEstimate),
    assigneeName: task.assignee?.fullName,
    assigneeAvatar: task.assignee?.avatar ?? undefined,
    dueDate: due?.text,
    dueDateUrgency: due?.urgency,
    onClick,
  }
}
