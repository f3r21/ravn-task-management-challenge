import { assertNever } from '@/lib/assert-never'
import type { PointEstimate, Status, TaskTag } from './task-types'

/**
 * The task form's fields and its submit lifecycle, kept as two separate things.
 *
 * Merging them — a single object with `name`, `tags` and `isSubmitting` — is how
 * forms end up able to represent states that make no sense, like "submitting and
 * also showing a validation error". Splitting them means the impossible
 * combinations cannot be written down.
 */

export interface TaskFormFields {
  name: string
  status: Status
  tags: TaskTag[]
  /** `yyyy-MM-dd`, the value shape of a native date input. */
  dueDate: string
  pointEstimate: PointEstimate
  assigneeId: string | null
  /**
   * The task's order within its column, as the text of a number input.
   *
   * A string rather than a number for the same reason `dueDate` is: it mirrors what
   * the input holds, including the empty string a user leaves behind when they clear
   * the field. Modelling it as a number would mean storing `NaN` for that state and
   * deciding what `NaN` means at every read. Coerced once, at the boundary that
   * builds the mutation.
   *
   * Empty is legitimate — on create the server assigns the position, and
   * `CreateTaskInput` has no field to send it in.
   */
  position: string
}

export type TaskFormAction =
  | { type: 'set-name'; name: string }
  | { type: 'set-status'; status: Status }
  | { type: 'set-tags'; tags: TaskTag[] }
  | { type: 'set-due-date'; dueDate: string }
  | { type: 'set-point-estimate'; pointEstimate: PointEstimate }
  | { type: 'set-assignee'; assigneeId: string | null }
  | { type: 'set-position'; position: string }

/**
 * A pure reducer over the fields.
 *
 * `assertNever` closes it, so adding a field to the form without handling its
 * action is a compile error rather than an input that silently does nothing.
 */
export function taskFormReducer(state: TaskFormFields, action: TaskFormAction): TaskFormFields {
  switch (action.type) {
    case 'set-name':
      return { ...state, name: action.name }
    case 'set-status':
      return { ...state, status: action.status }
    case 'set-tags':
      return { ...state, tags: action.tags }
    case 'set-due-date':
      return { ...state, dueDate: action.dueDate }
    case 'set-point-estimate':
      return { ...state, pointEstimate: action.pointEstimate }
    case 'set-assignee':
      return { ...state, assigneeId: action.assigneeId }
    case 'set-position':
      return { ...state, position: action.position }
    default:
      return assertNever(action, 'task form action')
  }
}

/**
 * What is wrong with the form right now, or nothing.
 *
 * Returns a message rather than a boolean so the caller has something to show;
 * a `isValid: false` would leave the component inventing its own wording.
 */
/** Which control the message is about, so the dialog can move focus to it. */
export type TaskFormField = 'name' | 'dueDate' | 'position'

export interface TaskFormProblem {
  field: TaskFormField
  message: string
}

/**
 * The first problem with the form, and **which field it belongs to**.
 *
 * The field is the load-bearing addition. This used to return a bare string, so the
 * dialog had nothing to aim focus at and sent it to the title input on every failure
 * — including "Pick a due date." and "Position has to be a number.", which are about
 * other controls. A keyboard or screen-reader user was told what was wrong and then
 * moved away from the thing that was wrong.
 */
export function validateTaskForm(fields: TaskFormFields): TaskFormProblem | undefined {
  if (fields.name.trim() === '') {
    return { field: 'name', message: 'Give the task a name.' }
  }
  if (fields.dueDate === '') {
    return { field: 'dueDate', message: 'Pick a due date.' }
  }
  // Checked last on purpose. Each of these returns the *first* problem, so moving
  // this above the two required fields would answer "what is wrong with this form"
  // with a note about ordering while the name was still blank.
  if (fields.position !== '' && !Number.isFinite(Number(fields.position))) {
    return { field: 'position', message: 'Position has to be a number.' }
  }
  return undefined
}
