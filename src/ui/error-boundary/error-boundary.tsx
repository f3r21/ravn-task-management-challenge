import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Rendered in place of `children` once an error is caught. */
  fallback?: ReactNode
  /**
   * Called with every error this boundary catches, before the fallback renders.
   *
   * This is the seam a crash reporter plugs into, and it is a prop rather than
   * an import on purpose: nothing is wired to it, because a challenge submission
   * with a Sentry DSN in it would be theatre. What it buys is that adding
   * reporting later is a change at the call site in `app.tsx`, not surgery on a
   * component every page renders through — and that the absence of reporting is
   * visible here rather than being something a reader has to notice is missing.
   *
   * Until something is passed, a production crash is reported to
   * `console.error` and nowhere else, which on a deployed build means nowhere.
   */
  onError?: (error: Error, info: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * Catches render-time errors below it and shows `fallback` instead of letting
 * the whole tree unmount to a blank page.
 *
 * There is deliberately no `reset()` method. React has no way to know whether
 * whatever caused the throw has been fixed, so a boundary that resets itself
 * just re-throws. Recovery is the caller's job: change the `key` prop and React
 * remounts the boundary with fresh state. That keeps the retry decision next to
 * the code that knows what "try again" means.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Logged first, and unconditionally. A reporter that throws — a misconfigured
    // DSN, an offline transport — must not be able to take the only other record
    // of the crash down with it.
    console.error('Unhandled error in render:', error, info.componentStack)
    this.props.onError?.(error, info)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}
