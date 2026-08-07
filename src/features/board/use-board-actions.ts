import { useToast } from '@/ui/toast/toast-context'
import type { ConfirmOutcome } from './delete-task-dialog'
import type { TaskFormFields } from './task-form-state'
import { toCreateInput, toUpdateInput } from './task-mapping'
import type { Task } from './task-types'
import { useCreateTask } from './use-create-task'
import { useDeleteTask } from './use-delete-task'
import { useUpdateTask } from './use-update-task'

export interface BoardActions {
  /** Rejects on failure, which is what keeps the create dialog open. */
  create: (fields: TaskFormFields) => Promise<void>
  /** Rejects on failure, carrying the message the edit dialog renders inline. */
  edit: (task: Task, fields: TaskFormFields) => Promise<void>
  /** Never rejects; reports whether the confirmation dialog should close. */
  remove: (task: Task) => Promise<ConfirmOutcome>
}

/**
 * The three things the board can do, and how each one is reported.
 *
 * Separated from `BoardPage` so that page is composition — it wires queries,
 * dialog state and these actions to markup, and holds none of them itself. What
 * lives here is the part that is neither rendering nor transport: which mutation
 * runs, what the user is told, and how a failure reaches the dialog that has to
 * react to it.
 *
 * How a form's fields become an API input is one layer further down, in
 * `task-mapping.ts`, because those rules are pure and worth table-testing on
 * their own.
 *
 * **The three do not report failure the same way, and the difference is
 * deliberate.** `create` and `edit` reject, because `TaskFormDialog` catches the
 * rejection to render the reason inline beside the form and keep itself open —
 * the exception is carrying the message, not just a signal. `remove` returns
 * `'keep-open'` instead, because the confirmation dialog has no room for an
 * inline error and the toast is the whole report; encoding that as a rethrow
 * meant an empty `catch` in the dialog and a contract invisible in the type.
 */
export function useBoardActions(): BoardActions {
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const toast = useToast()

  async function create(fields: TaskFormFields) {
    await createTask.mutateAsync(toCreateInput(fields))
    toast.show('success', 'Task created')
  }

  async function edit(task: Task, fields: TaskFormFields) {
    try {
      await updateTask.mutateAsync(toUpdateInput(task.id, fields))
      toast.show('success', 'Task updated')
    } catch (error) {
      // The brief asks for a notification whether the request succeeded *or*
      // failed, and the success half alone was the asymmetry. The dialog's own
      // `role="alert"` is still the primary report — it keeps the reason beside
      // the form the user is looking at — but it leaves with the dialog, and
      // someone who dismisses a failed save should not be left with no record.
      //
      // Rethrown because `TaskFormDialog` needs it to render that alert and stay
      // open. Swallowing it here would close the dialog on failure and throw the
      // user's edits away.
      toast.show('error', error instanceof Error ? error.message : 'Could not save the task.')
      throw error
    }
  }

  async function remove(task: Task): Promise<ConfirmOutcome> {
    try {
      await deleteTask.mutateAsync(task.id)
      toast.show('success', 'Task deleted')
      return 'close'
    } catch (error) {
      // The delete is the kind of action a user needs told about either way, and
      // the confirmation dialog has nowhere to put an inline error — so the toast
      // is the whole report and the dialog stays open for a retry.
      toast.show('error', error instanceof Error ? error.message : 'Could not delete the task.')
      return 'keep-open'
    }
  }

  return { create, edit, remove }
}
