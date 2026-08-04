import { useRef, type ReactNode, type RefObject } from 'react'
import { DismissButton, Overlay, usePopover, type AriaPopoverProps } from 'react-aria'
import type { OverlayTriggerState } from 'react-stately'

interface PopoverProps extends Omit<AriaPopoverProps, 'popoverRef'> {
  state: OverlayTriggerState
  children: ReactNode
  popoverRef?: RefObject<HTMLDivElement | null>
}

/**
 * The floating panel a select, a multi-select or the card menu opens into.
 *
 * `usePopover` handles positioning against the trigger, flipping when there is
 * no room below, and closing on outside interaction. The `DismissButton`s above
 * and below the content are visually hidden controls that give screen-reader
 * users a way out of the popover — without them, a user who swipes past the last
 * option lands back in the page behind with the popover still open.
 *
 * Portalled through `Overlay` so the board's horizontal scroll container cannot
 * clip it.
 */
export function Popover({ state, children, popoverRef, ...props }: PopoverProps) {
  const fallbackRef = useRef<HTMLDivElement>(null)
  const ref = popoverRef ?? fallbackRef

  const { popoverProps, underlayProps } = usePopover({ ...props, popoverRef: ref }, state)

  return (
    <Overlay>
      <div {...underlayProps} className="fixed inset-0" />
      <div
        {...popoverProps}
        ref={ref}
        // Escape is handled here, in the capture phase, for two reasons — both
        // found by driving this in a real browser rather than trusting jsdom.
        //
        // The selectable list inside binds Escape for its own purposes and stops
        // the event there, so neither the overlay's dismissal nor a bubble-phase
        // handler on this element ever sees it, and the list stays open.
        // Capturing runs before the list gets the event, so the popover wins.
        //
        // And this popover is portalled to the end of the body, but React
        // replays events up the *component* tree — an Escape that did get
        // through would also reach the dialog that rendered it and close both at
        // once, discarding a half-filled form. Stopping propagation after
        // closing makes Escape dismiss exactly one layer: the topmost.
        onKeyDownCapture={(event) => {
          if (event.key === 'Escape') {
            event.stopPropagation()
            state.close()
          }
        }}
        className="bg-surface-overlay rounded-card z-50 border border-white/10 shadow-xl"
      >
        <DismissButton
          onDismiss={() => {
            state.close()
          }}
        />
        {children}
        <DismissButton
          onDismiss={() => {
            state.close()
          }}
        />
      </div>
    </Overlay>
  )
}
