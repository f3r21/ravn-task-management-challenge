import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Rendered in place of `children` once an error is caught. */
  fallback?: ReactNode
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
    console.error('Unhandled error in render:', error, info.componentStack)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}
