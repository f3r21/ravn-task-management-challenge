import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ToastTone = 'success' | 'error'

interface Toast {
  id: number
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

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((tone: ToastTone, message: string) => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, tone, message }])
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, TOAST_DURATION_MS)
  }, [])

  // Memoised because this value is context: without it every render of the
  // provider would hand consumers a new object and re-render all of them.
  const api = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/*
       * One live region that persists across toasts, rather than a region per
       * toast. A live region only announces changes to its *contents* — mounting
       * a fresh region with text already in it announces nothing at all, which
       * is the usual reason toast notifications are silent to screen readers.
       *
       * `polite` so a confirmation waits its turn; a failure is still visible
       * and its text says what happened.
       */}
      <div
        role="status"
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 bottom-4 z-[100] flex flex-col gap-2"
      >
        {toasts.map((toast) => (
          <p
            key={toast.id}
            className={cn(
              'rounded-card text-body-m pointer-events-auto px-4 py-2 font-semibold shadow-lg',
              toast.tone === 'error'
                ? 'bg-danger text-text-primary'
                : 'bg-surface-overlay text-text-primary border border-white/10',
            )}
          >
            {toast.message}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
