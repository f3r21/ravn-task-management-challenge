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
 * **Not the only place this suffix is built.** `use-board-filters.ts:219` still
 * assembles it inline and does not import this helper, so a change to how a calendar
 * day is sent has to be made in both. This comment previously claimed the
 * consolidation was complete, which is the more expensive error: it invites a
 * maintainer to edit here, watch the suite pass, and ship a filter path still on the
 * old format.
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

/**
 * The edit, as a patch — only the fields the user actually changed.
 *
 * `UpdateTaskInput` is a patch type and `use-update-task.ts` documents the app as
 * relying on that, but this function used to resend the whole form snapshot, so no
 * call site had ever sent a partial one. The cost is a lost write rather than a
 * redundant one: the dialog seeds its fields when it opens, `refetchOnWindowFocus`
 * can pull a colleague's edit onto the board while it is open, and saving then
 * replays the stale snapshot over their change — two success toasts, no error, and
 * a card that silently reverts.
 *
 * The baseline comes from `toFormFields(task)` rather than from `task` directly, so
 * the comparison happens in the form's own vocabulary. A field is "unchanged" here
 * exactly when it looks unchanged to the user, which is the only definition that
 * cannot drift from what the dialog displayed.
 */
export function toUpdateInput(task: Task, fields: TaskFormFields): UpdateTaskInput {
  const before = toFormFields(task)
  const input: UpdateTaskInput = { id: task.id }

  if (fields.name.trim() !== before.name.trim()) {
    input.name = fields.name.trim()
  }
  if (fields.status !== before.status) {
    input.status = fields.status
  }
  // Order-insensitive: reordering the same tags is not an edit, and sending them
  // back would overwrite a concurrent tag change for no gain.
  if ([...fields.tags].sort().join() !== [...before.tags].sort().join()) {
    input.tags = fields.tags
  }
  if (fields.dueDate !== before.dueDate) {
    input.dueDate = toApiDateTime(fields.dueDate)
  }
  if (fields.pointEstimate !== before.pointEstimate) {
    input.pointEstimate = fields.pointEstimate
  }
  // Blank means "leave it alone", which is why this is not simply a value compare —
  // an empty field is the absence of an instruction rather than a request for 0.
  if (fields.position.trim() !== '' && Number(fields.position) !== task.position) {
    input.position = Number(fields.position)
  }
  if (fields.assigneeId !== before.assigneeId) {
    input.assigneeId = fields.assigneeId
  }

  return input
}
