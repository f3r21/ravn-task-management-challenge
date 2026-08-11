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
 * Renders through `@ravn/ui-kit`'s `Modal`. It did not for a long time, and the
 * reasons are worth keeping because they are what a reviewer will otherwise
 * rediscover: the kit's `Modal` had no `role` prop, then had one but destructured
 * only `dialogProps` and `titleProps` from `useDialog`, dropping `contentProps`.
 * For an `alertdialog` that is not cosmetic — `useDialog` generates an id, points
 * `aria-describedby` at it, and discards it in a layout effect if nothing carries
 * it (`useSlotId`), so the role was announced without the body text that is the
 * whole reason for choosing the role.
 *
 * Both were fixed in the kit rather than worked around here, which is the standing
 * rule in `.claude/rules/ui-kit.md`: ravn-ui-kit#66 wired `contentProps` and made
 * `isDismissable` a real prop driving both the backdrop and — through
 * `isKeyboardDismissDisabled` — Escape, closing ravn-ui-kit#64. Shipped in `v0.5.2`,
 * adopted in app#30.
 *
 * What the kit still does not gate is its own close button, which calls `onClose`
 * unconditionally. That is why `onClose` is gated on `isDeleting` below as well as
 * `isDismissable` being passed: the two cover different dismissal routes and
 * neither is redundant.
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
