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
}

export type TaskFormAction =
  | { type: 'set-name'; name: string }
  | { type: 'set-status'; status: Status }
  | { type: 'set-tags'; tags: TaskTag[] }
  | { type: 'set-due-date'; dueDate: string }
  | { type: 'set-point-estimate'; pointEstimate: PointEstimate }
  | { type: 'set-assignee'; assigneeId: string | null }

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
export function validateTaskForm(fields: TaskFormFields): string | undefined {
  if (fields.name.trim() === '') {
    return 'Give the task a name.'
  }
  if (fields.dueDate === '') {
    return 'Pick a due date.'
  }
  return undefined
}
