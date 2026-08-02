import { useRef, type ReactNode } from 'react'
import { Overlay, useDialog, useModalOverlay, type AriaModalOverlayProps } from 'react-aria'
import type { OverlayTriggerState } from 'react-stately'
import { cn } from '@/lib/cn'

interface DialogProps extends AriaModalOverlayProps {
  state: OverlayTriggerState
  title: string
  children: ReactNode
  className?: string
}

/**
 * A modal dialog.
 *
 * Built on React Aria's `useModalOverlay` and `useDialog` rather than
 * hand-rolled, because the parts that make a modal correct are the parts that
 * are easy to get subtly wrong: trapping focus inside it, restoring focus to
 * whatever opened it on close, closing on Escape, marking the rest of the page
 * inert so a screen reader does not wander out of the dialog, and locking body
 * scroll. Every one of those is a defect a user hits and a reviewer notices.
 *
 * `Overlay` portals the dialog to the end of the body, so the card's
 * `overflow-hidden` and the board's scroll container cannot clip it.
 *
 * The title is a prop rather than a child because `useDialog` needs to point
 * `aria-labelledby` at it — a dialog whose name is optional is a dialog that
 * ships unnamed.
 */
export function Dialog({ state, title, children, className, ...props }: DialogProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const { modalProps, underlayProps } = useModalOverlay(props, state, modalRef)
  const { dialogProps, titleProps } = useDialog({ role: 'dialog' }, dialogRef)

  return (
    <Overlay>
      <div
        {...underlayProps}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      >
        <div {...modalProps} ref={modalRef} className="w-full max-w-[578px]">
          <div
            {...dialogProps}
            ref={dialogRef}
            className={cn(
              'bg-surface-overlay rounded-card flex flex-col gap-6 p-4 outline-none',
              className,
            )}
          >
            <h2 {...titleProps} className="sr-only">
              {title}
            </h2>
            {children}
          </div>
        </div>
      </div>
    </Overlay>
  )
}
