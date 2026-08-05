import { useRef, type ReactNode } from 'react'
import { Overlay, useDialog, useModalOverlay, type AriaModalOverlayProps } from 'react-aria'
import type { OverlayTriggerState } from 'react-stately'
import { cn } from '@/lib/cn'

interface DialogProps extends AriaModalOverlayProps {
  state: OverlayTriggerState
  title: string
  children: ReactNode
  className?: string
  /**
   * `alertdialog` for a consequential, interrupting decision — a delete
   * confirmation. It makes assistive tech announce the body text on open rather
   * than the title alone.
   */
  role?: 'dialog' | 'alertdialog'
}

/**
 * A modal dialog.
 *
 * Built on React Aria's `useModalOverlay` and `useDialog` rather than hand-rolled,
 * because the parts that make a modal correct are the parts that are easy to get
 * subtly wrong: containing focus, restoring it to whatever opened the dialog,
 * closing on Escape, marking the rest of the page inert, and locking body scroll.
 *
 * `Overlay` portals the dialog to the end of the body, so the card's
 * `overflow-hidden` and the board's scroll container cannot clip it.
 *
 * The hooks live in `ModalContents`, a child of `<Overlay>`, and that split is
 * load-bearing rather than tidiness. `Overlay` renders the `FocusScope` that
 * contains and restores focus, but it only switches *containment* on when
 * something inside it asks: `useModalOverlay` and `useDialog` each call React
 * Aria's `useOverlayFocusContain`, which reads a context `Overlay` provides to its
 * children. Calling those hooks in the component that *renders* `<Overlay>` puts
 * them above that provider, so the context is null, the request is silently
 * dropped, and the scope is built with containment off — Tab then walks straight
 * out of the modal, and since Escape is bound to the dialog element, the modal
 * cannot be dismissed from the keyboard once focus has left.
 *
 * Restoration kept working throughout, which is what made this hard to see:
 * `Overlay` hardcodes `restoreFocus`, and only `contain` depends on the context.
 */
export function Dialog({ state, ...props }: DialogProps) {
  return (
    <Overlay>
      <ModalContents state={state} {...props} />
    </Overlay>
  )
}

/**
 * The title is a prop rather than a child because `useDialog` needs to point
 * `aria-labelledby` at it — a dialog whose name is optional is a dialog that ships
 * unnamed.
 */
function ModalContents({
  state,
  title,
  children,
  className,
  role = 'dialog',
  ...props
}: DialogProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const { modalProps, underlayProps } = useModalOverlay(props, state, modalRef)
  // `contentProps` is the third return value and was being dropped. For an
  // `alertdialog` `useDialog` generates an id, points `aria-describedby` at it, and
  // then checks in a layout effect whether any element actually carries it —
  // `useSlotId` discards the id if nothing does. Nothing did, so the description
  // resolved to `undefined` and the role's whole reason for being chosen (announcing
  // the body, not just the name) was absent.
  const { dialogProps, titleProps, contentProps } = useDialog({ role }, dialogRef)

  return (
    <div
      {...underlayProps}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div {...modalProps} ref={modalRef} className="w-full max-w-[578px]">
        <div
          {...dialogProps}
          ref={dialogRef}
          className={cn('bg-surface-overlay rounded-sm flex flex-col p-4 outline-none', className)}
        >
          <h2 {...titleProps} className="sr-only">
            {title}
          </h2>
          <div {...contentProps} className="flex flex-col gap-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
