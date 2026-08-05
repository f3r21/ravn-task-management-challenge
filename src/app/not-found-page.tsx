import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-body-l font-semibold">This page does not exist</h1>
      <p className="text-muted">The link may be out of date, or the task may have been deleted.</p>
      {/* `text-interactive-text`, not `text-interactive`: primary-4 is a fill and
          border colour, and on the shell it measures 4.02:1 — enough for a border or
          an icon, short of the 4.5:1 this link owes as text. primary-2 is 7.63:1. */}
      <Link to="/" className="text-interactive-text font-semibold underline underline-offset-4">
        Back to the dashboard
      </Link>
    </main>
  )
}
