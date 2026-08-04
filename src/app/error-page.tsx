interface ErrorPageProps {
  /** Shown above the retry affordance. Keep it about what the user can do. */
  message?: string
  onRetry?: () => void
}

export function ErrorPage({
  message = 'Something went wrong while loading this page.',
  onRetry,
}: ErrorPageProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      {/* `role="alert"` so a screen reader announces the failure when this
          replaces the content, rather than leaving the user on a silent page. */}
      <h1 className="text-body-l font-semibold" role="alert">
        {message}
      </h1>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-card bg-brand px-4 py-2 font-semibold text-text-primary"
        >
          Try again
        </button>
      ) : null}
    </main>
  )
}
