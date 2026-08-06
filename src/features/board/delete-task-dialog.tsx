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
 *
 * Stays on the app's own `Dialog` rather than `@ravn/ui-kit`'s `Modal` — but
 * as a blocked migration, not a permanent decision. It used to be permanent,
 * on the grounds that the kit's `Modal` had no `role` prop at all; that is no
 * longer true, and the reason it is still blocked is narrower and fixable:
 *
 * The kit's `Modal` accepts `role="alertdialog"` and now runs on
 * `useModalOverlay`, so it aria-hides the page and locks scroll like this one.
 * What it does not do is keep `useDialog`'s third return value. For an
 * `alertdialog`, `useDialog` generates an id, points `aria-describedby` at it,
 * and then discards the id in a layout effect if nothing carries it
 * (`useSlotId`). The kit destructures only `dialogProps` and `titleProps`, so
 * nothing ever carries it — the role is announced without the body text that is
 * the entire reason for choosing the role. This app's `Dialog` spreads
 * `contentProps` and has a test asserting the description, which is exactly the
 * assertion the kit would fail.
 *
 * Two smaller gaps ride along: the kit hardcodes `isDismissable: true`, so the
 * `!isDeleting` guard below has nowhere to go, and its chrome is a visible
 * title bar with a close button rather than this dialog's sr-only title over
 * its own prompt.
 *
 * Per the standing rule (`.claude/rules/ui-kit.md`), those are kit fixes, not
 * reasons to relax anything here. `TaskFormDialog` was blocked on this same
 * `Dialog` once too — a cross-module `FocusScope` bug, since fixed upstream —
 * and migrated the moment the kit caught up. This should follow the same way.
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
