import type { AccentColor, DueDateUrgency, TaskCardProps, TaskTableRowProps } from '@ravn/ui-kit'
import { avatarSrcUnlessDecommissioned } from '@/lib/decommissioned-avatar'
import { dueDateTone, formatDueDate, parseApiDate } from '@/lib/due-date'
import { pointValue, tagAccent, tagLabel } from '../task-display'
import type { Task } from '../task-types'

/**
 * Everything a `Task` shows, computed once, before either kit shape names it.
 *
 * **This type is how the board and the list view are kept from drifting.** The app used
 * to render both through one component with a `layout='card'|'row'` switch, precisely so
 * "the two cannot drift into showing different information". The kit splits them into two
 * structurally different components with two different prop vocabularies —
 * `points`/`estimationPoints`, `dueDateText`/`dueDate` — and that switch is gone.
 *
 * What replaces it is this: the two exported functions below compute *nothing*. They take
 * these seven fields and rename them. A field that reaches one view and not the other is
 * caught twice over, and neither check is a matter of remembering:
 *
 * - `KIT_FIELD_NAMES` is `satisfies Record<keyof TaskPresentation, …>`, so adding a field
 *   here without saying what it is called on both components is a **compile error**.
 * - `to-kit-props.test.ts` walks that table and asserts both outputs carry the same value
 *   under their two names, so wiring a field into only one is a **test failure**.
 *
 * The `keyof TaskCardProps` / `keyof TaskTableRowProps` constraints do a third job: they
 * fail the build if the kit renames a prop under us, which is the failure a plain string
 * map would have absorbed silently.
 */
interface TaskPresentation {
  title: string
  points: number
  /** `undefined` when the API sent a date that does not parse — the tag is then hidden. */
  dueDateText: string | undefined
  dueDateUrgency: DueDateUrgency
  tags: { label: string; variant: AccentColor }[]
  assigneeName: string | undefined
  assigneeAvatar: string | undefined
}

/** What each presentation field is called on each kit component. See `TaskPresentation`. */
export const KIT_FIELD_NAMES = {
  title: { card: 'title', row: 'title' },
  points: { card: 'points', row: 'estimationPoints' },
  dueDateText: { card: 'dueDateText', row: 'dueDate' },
  dueDateUrgency: { card: 'dueDateUrgency', row: 'dueDateUrgency' },
  tags: { card: 'tags', row: 'tags' },
  assigneeName: { card: 'assigneeName', row: 'assigneeName' },
  assigneeAvatar: { card: 'assigneeAvatar', row: 'assigneeAvatar' },
} as const satisfies Record<
  keyof TaskPresentation,
  { card: keyof TaskCardProps; row: keyof TaskTableRowProps }
>

/**
 * `now` is required rather than defaulting to `new Date()`, so this stays a pure function
 * of its arguments and every test over it is time-independent.
 */
function taskPresentation(task: Task, now: Date): TaskPresentation {
  const dueDate = parseApiDate(task.dueDate)

  return {
    title: task.name,
    points: pointValue(task.pointEstimate),
    dueDateText: dueDate ? formatDueDate(dueDate, now) : undefined,
    // Assigned straight across, with no map in between. The app's `DueDateTone` and the
    // kit's `DueDateUrgency` are the same three members — the kit renamed its `warning` to
    // `soon` to match this app — so a translation table would now be an identity function
    // that could only ever introduce a bug. The assignment itself is the check: rename a
    // member on either side and this line stops compiling.
    dueDateUrgency: dueDate ? dueDateTone(dueDate, now) : 'normal',
    // Likewise no map. `tagAccent` returns the kit's own `AccentColor`, so the five app
    // tags already speak the kit's vocabulary; the earlier adapter's five-entry
    // `TAG_TO_KIT_VARIANT` was translating between two spellings of the same thing.
    tags: task.tags.map((tag) => ({ label: tagLabel(tag), variant: tagAccent(tag) })),
    assigneeName: task.assignee?.fullName,
    // The guard that used to sit in the card's JSX, moved here because this is now the only
    // place a `User.avatar` becomes component props — and it has to cover *both* views.
    //
    // Every avatar the live API serves points at `avatars.dicebear.com`, which is
    // decommissioned and answers 410 with a perfectly valid SVG, so the `<img>` fires
    // `load` and renders a grey-and-red placeholder. There is no error to catch; the URL
    // has to be dropped before the kit ever sees it, which is what lets `Avatar` fall back
    // to initials. See `lib/decommissioned-avatar.ts` for the full autopsy.
    assigneeAvatar: avatarSrcUnlessDecommissioned(task.assignee?.avatar),
  }
}

/** Extra props the board supplies per card, on top of what the task itself determines. */
interface CardOptions {
  /** The per-card overflow menu, rendered beside the title. */
  actions?: TaskCardProps['actions']
  /** One level below the heading that introduces the column. */
  headingLevel?: TaskCardProps['headingLevel']
}

export function toKitCardProps(task: Task, now: Date, options: CardOptions = {}): TaskCardProps {
  const shown = taskPresentation(task, now)

  return {
    title: shown.title,
    points: shown.points,
    dueDateText: shown.dueDateText,
    dueDateUrgency: shown.dueDateUrgency,
    tags: shown.tags,
    assigneeName: shown.assigneeName,
    assigneeAvatar: shown.assigneeAvatar,
    ...options,
    // `metaBadges` is deliberately never passed, and its absence is the decision rather
    // than an omission. The card's attachment / subtask / comment counters were hardcoded
    // — the schema has no fields behind any of them — and the app hid them with
    // `aria-hidden` on the reasoning that announcing counts that are not real is worse
    // than silence.
    //
    // **The kit gap that used to be the second reason is closed, and the decision does not
    // move.** Through v0.7.0 each badge's label went into an `sr-only` node (kit#19) with no
    // way to render one silently, so passing them would have read invented numbers aloud.
    // v0.8.0 adds the `decorative: true` arm ravn-ui-kit#93 tracked — a badge with no
    // accessible name, typed so that `decorative` and `label` cannot both be given:
    //
    //     git show v0.8.0:dist/index.d.ts | grep -c TaskMetaBadgeDecorative   # 3
    //     git show v0.7.0:dist/index.d.ts | grep -c TaskMetaBadgeDecorative   # 0
    //     git show v0.7.0:dist/index.d.ts | grep -c TaskMetaBadge             # 10 — control,
    //         so the 0 above is the type being absent and not a pattern that never matched
    //
    // That only ever removed the accessibility objection. These are omitted because the
    // numbers are invented, which no kit release can change, and showing invented data
    // silently is still showing invented data. Restoring them needs schema fields behind
    // them, not a prop.
    //
    // No `onClick` either: the app has never had a click-to-open card, and providing one
    // is what turns the kit's title into a `<button>`. Omitted, it stays a plain heading,
    // which is what this app renders today.
  }
}

/** Extra props the list view supplies per row, on top of what the task determines. */
interface RowOptions {
  /** Position within its status group, 1-based — the kit zero-pads it for display. */
  index: number
  /** The per-task overflow menu, rendered in the row's own actions slot. */
  actions?: TaskTableRowProps['actions']
  /** One level below the group header, so the list view's outline nests. */
  headingLevel?: TaskTableRowProps['headingLevel']
}

export function toKitTableRowProps(task: Task, now: Date, options: RowOptions): TaskTableRowProps {
  const shown = taskPresentation(task, now)

  return {
    title: shown.title,
    estimationPoints: shown.points,
    dueDate: shown.dueDateText,
    dueDateUrgency: shown.dueDateUrgency,
    tags: shown.tags,
    assigneeName: shown.assigneeName,
    assigneeAvatar: shown.assigneeAvatar,
    ...options,
    // The row's select checkbox is `sr-only` rather than merely invisible, so without this
    // every row would put a checkbox in the accessibility tree — announced, tabbable, and
    // wired to nothing, because this app has no bulk-selection feature. `isSelectable` is
    // the prop kit#9 added for exactly this.
    isSelectable: false,
  }
}
