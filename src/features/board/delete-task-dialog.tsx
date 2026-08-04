import { useState } from 'react'
import type { OverlayTriggerState } from 'react-stately'
import { Button } from '@/ui/button/button'
import { Dialog } from '@/ui/dialog/dialog'
import type { Task } from './task-types'

interface DeleteTaskDialogProps {
  state: OverlayTriggerState
  task: Task
  onConfirm: () => Promise<void>
}

/**
 * Confirmation before deleting.
 *
 * The task's name is in the prompt, not just "this task": the menu that opened
 * this dialog is one of many identical menus on the board, and a user who
 * opened the wrong one has no other way to notice before the task is gone.
 *
 * `role="alertdialog"` rather than `dialog` — it tells assistive tech this
 * interrupts for a consequential decision, and the message is announced on open
 * instead of only the title.
 */
export function DeleteTaskDialog({ state, task, onConfirm }: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleConfirm() {
    setIsDeleting(true)
    try {
      await onConfirm()
      state.close()
    } catch {
      // Swallowed on purpose. `onConfirm` rejects to say "do not close", and it
      // has already reported the failure to the user — it owns the message,
      // since only it knows what went wrong. Letting the rejection escape here
      // would surface as an unhandled promise rejection instead, which is how
      // this was caught: the tests passed while the process reported an error.
    } finally {
      // Reset even on failure: the dialog stays open so the user can retry, and
      // a permanently disabled button would leave them stuck.
      setIsDeleting(false)
    }
  }

  return (
    <Dialog
      state={state}
      title={`Delete ${task.name}`}
      role="alertdialog"
      isDismissable={!isDeleting}
    >
      <p className="text-body-l font-semibold">Delete “{task.name}”?</p>
      <p className="text-muted text-body-m">This cannot be undone.</p>

      <div className="flex justify-end gap-6">
        <Button
          variant="text"
          onPress={() => {
            state.close()
          }}
          isDisabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onPress={() => {
            void handleConfirm()
          }}
          isDisabled={isDeleting}
        >
          {isDeleting ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    </Dialog>
  )
}
