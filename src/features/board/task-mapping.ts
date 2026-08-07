import type { CreateTaskInput, UpdateTaskInput } from '@/graphql/generated/graphql'
import { parseApiDate, toDateInputValue } from '@/lib/due-date'
import type { TaskFormFields } from './task-form-state'
import type { Task } from './task-types'

/**
 * The form's fields, turned into what the API accepts.
 *
 * Pulled out of `BoardPage` because these are transport-contract rules, not
 * rendering, and inside a component they were untestable except by driving a
 * menu, a dialog and a Select popover to observe one serialised field. Every rule
 * below is one `CLAUDE.md` records as having already cost a defect, so each is
 * pinned directly in `task-mapping.test.ts`.
 *
 * Nothing here reads the clock, the DOM or React state — same discipline as
 * `task-display.ts` next door, and the reason a table test can cover it.
 */

/**
 * The instant the API means by a calendar day.
 *
 * The form collects `yyyy-MM-dd` from a native date input; the API wants a
 * `DateTime`. Midnight UTC is the instant `due-date.ts` reads back as that same
 * calendar day, which is the property that matters — the suite deliberately runs
 * at UTC+14, where anything reaching for a local calendar field lands a day early.
 *
 * This suffix used to be written out at three sites (`board-page.tsx`, and twice
 * in `use-board-filters.ts`) with no shared constant. Three copies of a format
 * string is three chances for one of them to drift.
 */
export function toApiDateTime(yyyyMmDd: string): string {
  return `${yyyyMmDd}T00:00:00.000Z`
}

/**
 * A new task.
 *
 * `assigneeId` is **omitted** when nobody is assigned, rather than sent as
 * `null` — and the mirror-image rule on update is the one to read alongside it.
 * There is no `position`: the server assigns it, and `CreateTaskInput` has no
 * field to carry one, which is why the form only offers that control in edit mode.
 */
export function toCreateInput(fields: TaskFormFields): CreateTaskInput {
  return {
    name: fields.name.trim(),
    status: fields.status,
    tags: fields.tags,
    dueDate: toApiDateTime(fields.dueDate),
    pointEstimate: fields.pointEstimate,
    ...(fields.assigneeId ? { assigneeId: fields.assigneeId } : {}),
  }
}

/**
 * An edit to an existing task.
 *
 * `UpdateTaskInput` is a **patch**, and the two nullable fields below take
 * opposite rules for that reason — this is the part that has bitten twice:
 *
 * - `assigneeId` is always sent, `null` included. Omitting it means "leave it as
 *   it is", which made unassigning a task impossible; `null` is the only way to
 *   say "nobody".
 * - `position` is omitted when the field is blank, because it is a `Float!` and
 *   `null` there is a request to *unset* it rather than to leave it alone.
 *   Omitting is what leaves the server's own ordering untouched.
 *
 * The blank check is `trim() === ''` rather than a truthiness test, because `'0'`
 * is a legitimate position — moving a task to the top of its column — and would
 * be dropped by `if (fields.position)`.
 */
/**
 * An existing task, turned into the form's starting values.
 *
 * The other direction, and it belongs beside the outbound mappers rather than
 * inline at the dialog's call site — that spelling parsed `dueDate` twice and
 * needed an `as Date` assertion to convince TypeScript the second parse had
 * succeeded because the first one had.
 *
 * An unparseable `dueDate` becomes an empty field rather than throwing. The API
 * types it non-null, so this should not happen; if it ever does, an empty date
 * input the user can fill in is a better outcome than a board that will not open
 * its edit dialog.
 */
export function toFormFields(task: Task): TaskFormFields {
  const dueDate = parseApiDate(task.dueDate)

  return {
    name: task.name,
    status: task.status,
    tags: task.tags,
    dueDate: dueDate ? toDateInputValue(dueDate) : '',
    pointEstimate: task.pointEstimate,
    position: String(task.position),
    assigneeId: task.assignee?.id ?? null,
  }
}

export function toUpdateInput(id: string, fields: TaskFormFields): UpdateTaskInput {
  return {
    id,
    name: fields.name.trim(),
    status: fields.status,
    tags: fields.tags,
    dueDate: toApiDateTime(fields.dueDate),
    pointEstimate: fields.pointEstimate,
    ...(fields.position.trim() === '' ? {} : { position: Number(fields.position) }),
    assigneeId: fields.assigneeId,
  }
}
