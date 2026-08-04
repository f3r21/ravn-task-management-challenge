import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useButton, useToast as useAriaToast, useToastRegion } from 'react-aria'
import { useToastState, type QueuedToast, type ToastState } from 'react-stately'
import { cn } from '@/lib/cn'
import { CloseIcon } from '@/ui/icons/icons'

export type ToastTone = 'success' | 'error'

interface ToastContent {
  tone: ToastTone
  message: string
}

interface ToastApi {
  show: (tone: ToastTone, message: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

/**
 * Throws rather than returning undefined outside a provider.
 *
 * A silent no-op would mean a mutation reporting success into nothing, and the
 * missing provider would only be noticed when someone wondered why they never
 * see confirmations.
 */
export function useToast(): ToastApi {
  const api = useContext(ToastContext)
  if (!api) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return api
}

/** How long a toast stays before dismissing itself. */
const TOAST_DURATION_MS = 5000

function Toast({
  toast,
  state,
}: {
  toast: QueuedToast<ToastContent>
  state: ToastState<ToastContent>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const { toastProps, contentProps, titleProps, closeButtonProps } = useAriaToast(
    { toast },
    state,
    ref,
  )
  // `closeButtonProps` is an `AriaButtonProps` — it carries `onPress`, not DOM
  // handlers. Spread straight onto a `<button>` it renders a button that does
  // nothing; `useButton` is what turns it into something clickable.
  const { buttonProps: closeProps } = useButton(closeButtonProps, closeRef)

  return (
    <div
      {...toastProps}
      ref={ref}
      className={cn(
        'rounded-card text-body-m pointer-events-auto flex items-center gap-3 px-4 py-2 font-semibold shadow-lg',
        toast.content.tone === 'error'
          ? 'bg-danger text-text-primary'
          : 'bg-surface-overlay text-text-primary border border-white/10',
      )}
    >
      <div {...contentProps}>
        <span {...titleProps}>{toast.content.message}</span>
      </div>
      <button
        {...closeProps}
        ref={closeRef}
        className="text-text-primary/70 hover:text-text-primary shrink-0 transition-colors"
      >
        <CloseIcon className="size-4" />
      </button>
    </div>
  )
}

/**
 * The notification region.
 *
 * Built on `useToastRegion` rather than a hand-rolled `aria-live` container,
 * because the region has to survive a modal. React Aria hides everything outside an
 * open modal from the accessibility tree, walking out from `document.body` — and the
 * notifications sit outside the modal by necessity, so they were hidden exactly when
 * they mattered most. The delete confirmation stays open on failure and carries no
 * inline error by design, which made its notification the only report the user got,
 * delivered where assistive tech could not reach it.
 *
 * `useToastRegion` marks itself as a top layer, which is the exemption that hiding
 * pass checks for. Relying on the hook rather than writing that attribute by hand is
 * deliberate: it is React Aria's own internal contract, untyped and unpublished, so
 * the supported way to depend on it is through the hook that owns it.
 *
 * The marker alone is not enough, which is the part that is easy to get wrong. The
 * hiding pass walks out from `document.body` and hides whole subtrees at the highest
 * level it can; an exempt node nested inside a hidden ancestor is never reached,
 * because the ancestor was already rejected. So the region is portalled to the body
 * as well — marked *and* a sibling of the modal rather than a descendant of the page
 * it hides. Either half on its own leaves the notification unreachable.
 *
 * It also brings a close button, and pauses the dismiss timers while the region is
 * hovered or focused — a toast that vanishes mid-read is its own defect.
 */
function ToastRegion({ state }: { state: ToastState<ToastContent> }) {
  const ref = useRef<HTMLDivElement>(null)
  // Named "Alerts" rather than the hook's default "Notifications": the header's
  // bell button is already called Notifications, and two landmarks with one name
  // is a worse thing to hand a screen reader than a slightly duller label.
  const { regionProps } = useToastRegion({ 'aria-label': 'Alerts' }, state, ref)

  return createPortal(
    <div
      {...regionProps}
      ref={ref}
      className="pointer-events-none fixed right-4 bottom-4 z-[100] flex flex-col gap-2"
    >
      {state.visibleToasts.map((toast) => (
        <Toast key={toast.key} toast={toast} state={state} />
      ))}
    </div>,
    document.body,
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const state = useToastState<ToastContent>({ maxVisibleToasts: 4 })

  // The state object is rebuilt on each render, so `show` reads it through a ref
  // rather than closing over one. That keeps the context value stable — otherwise
  // every provider render would hand consumers a new object and re-render all of
  // them.
  //
  // Synced in an effect rather than assigned during render, which is not safe under
  // concurrent rendering. Nothing can observe the gap: `show` is only ever called
  // from an event handler, long after the first effect has flushed.
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  const api = useMemo<ToastApi>(
    () => ({
      show: (tone, message) => {
        stateRef.current.add({ tone, message }, { timeout: TOAST_DURATION_MS })
      },
    }),
    [],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Mounted only while there is something to show. An empty region is a
          landmark a screen-reader user can navigate to and find nothing in. */}
      {state.visibleToasts.length > 0 ? <ToastRegion state={state} /> : null}
    </ToastContext.Provider>
  )
}
