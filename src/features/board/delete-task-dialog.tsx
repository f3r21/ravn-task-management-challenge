import { useState } from 'react'
import type { OverlayTriggerState } from 'react-stately'
import { Modal, TextButton } from '@ravn/ui-kit'
import type { Task } from './task-types'

/**
 * What `onConfirm` reports back, and why it is a value rather than an exception.
 *
 * This used to be `Promise<void>`, where "the delete failed, stay open" was
 * signalled by *rethrowing* after the handler had already reported the failure —
 * and this component caught that rethrow in an empty block. Both halves were
 * documented, and neither was visible in the type: nothing stopped a new caller
 * from resolving normally after a failure and closing a dialog over an error the
 * user never saw. The empty `catch` was itself added to fix an unhandled
 * rejection, which is the shape of bug the arrangement invited.
 *
 * Saying it in the signature costs one union and removes both.
 */
export type ConfirmOutcome = 'close' | 'keep-open'

interface DeleteTaskDialogProps {
  state: OverlayTriggerState
  task: Task
  /**
   * Performs the delete and says what should happen to this dialog.
   *
   * It owns reporting the failure to the user — only it knows what went wrong —
   * and is expected to resolve rather than reject. A rejection is a contract
   * violation rather than a control-flow signal, and is deliberately not caught
   * here so that it surfaces instead of closing the dialog silently.
   */
  onConfirm: () => Promise<ConfirmOutcome>
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
      if ((await onConfirm()) === 'close') {
        state.close()
      }
    } finally {
      // Reset even when the dialog stays open: the user can retry, and a
      // permanently disabled button would leave them stuck.
      setIsDeleting(false)
    }
  }

  return (
    <Modal
      isOpen={state.isOpen}
      // Gated as well as `isDismissable`, because they cover different routes.
      // `isDismissable` drives react-aria's backdrop and Escape handling, so those
      // two are prevented outright. The kit's own close button calls `onClose`
      // unconditionally, so this is what stops it dismissing a delete already in
      // flight — the case `update-delete-task.test.tsx` exists for.
      onClose={() => {
        if (!isDeleting) state.close()
      }}
      title={`Delete ${task.name}`}
      role="alertdialog"
      isDismissable={!isDeleting}
      // The app's own panel width, which the kit defaults to `max-w-md`.
      width="max-w-[578px]"
    >
      {/* The kit renders the title visibly, where this app's `Dialog` kept it
          `sr-only`. So "Delete “{name}”?" as a body line would now repeat the
          header word for word. The name still reaches the user — it is the
          heading — and the body is left as the consequence alone, which is also
          what `aria-describedby` now points at. */}
      <div className="flex flex-col gap-6">
        <p className="text-muted text-body-m">This cannot be undone.</p>

        <div className="flex justify-end gap-6">
          <TextButton
            variant="secondary"
            onPress={() => {
              state.close()
            }}
            isDisabled={isDeleting}
          >
            Cancel
          </TextButton>
          <TextButton
            variant="primary"
            onPress={() => {
              void handleConfirm()
            }}
            isDisabled={isDeleting}
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </TextButton>
        </div>
      </div>
    </Modal>
  )
}
