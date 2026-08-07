import type { ReactNode } from 'react'
import { TextButton } from '@ravn/ui-kit'
import { ApiError } from '@/graphql/client'
import { cn } from '@/lib/cn'

interface AsyncSectionProps {
  /** React Query's own status, passed straight through. */
  status: 'pending' | 'error' | 'success'
  /** The query's error. Narrowed to `ApiError` here, so callers do not repeat it. */
  error?: unknown
  /** Announced while the request is in flight. */
  loadingLabel: string
  /**
   * Announced once it has arrived. Callers that have something to count build this
   * themselves — "12 tasks loaded" — since only they know what was loaded.
   */
  readyLabel: string
  /** Heading of the error block. Says which thing failed, not that something did. */
  errorTitle: string
  /** Shown when the failure is not an `ApiError` and so carries no message for a user. */
  errorFallback: string
  skeleton: ReactNode
  onRetry: () => void
  /** Layout for the error block, which differs by page. */
  errorClassName?: string
  children: ReactNode
}

/**
 * The loading / error / ready triad, with the live region that announces it.
 *
 * Built independently in `BoardPage` and `ProfilePage` before this, four pieces
 * at a time: a copy function, an `sr-only` live region, a skeleton and an error
 * block with its own hand-rolled retry button. The two drifted, as two copies do
 * — the retry was written three times with three different class strings while
 * `Button` already existed and was used a few lines below one of them.
 *
 * **The live region and the words it announces are deliberately in the same
 * component, and that is the load-bearing part of this design.** A live region
 * reports *changes* to its contents, so one that mounts with its text already
 * inside announces nothing at all — which means the copy is only correct while
 * the region outlives every state it describes. Splitting the two puts that rule
 * in one file and the thing it governs in another, and the next person to read
 * either half will not see it. Three components in this app made exactly that
 * mistake before; keeping them together is what stops a fourth.
 *
 * The error branch announces the empty string on purpose. The block below carries
 * `role="alert"`, which announces itself, and a live region repeating it would
 * say the failure twice.
 */
export function AsyncSection({
  status,
  error,
  loadingLabel,
  readyLabel,
  errorTitle,
  errorFallback,
  skeleton,
  onRetry,
  errorClassName,
  children,
}: AsyncSectionProps) {
  const message = error instanceof ApiError ? error.message : errorFallback
  // A rejected token is not worth retrying — the request will fail identically
  // until someone changes the configuration, and a button that cannot work is
  // worse than no button.
  const isUnauthenticated = error instanceof ApiError && error.isUnauthenticated

  return (
    <>
      {/* Rendered unconditionally, so it is the same element across all three
          states and only its text changes. See the note above. */}
      <p role="status" className="sr-only">
        {status === 'pending' ? loadingLabel : status === 'error' ? '' : readyLabel}
      </p>

      {status === 'pending' ? skeleton : null}

      {status === 'error' ? (
        <div role="alert" className={cn('flex flex-col gap-4', errorClassName)}>
          <p className="text-body-l font-semibold">{errorTitle}</p>
          <p className="text-muted text-body-m max-w-md">{message}</p>
          {isUnauthenticated ? null : (
            <TextButton variant="primary" onPress={onRetry}>
              Try again
            </TextButton>
          )}
        </div>
      ) : null}

      {status === 'success' ? children : null}
    </>
  )
}
