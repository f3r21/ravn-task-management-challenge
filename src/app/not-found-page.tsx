import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-body-l font-semibold">This page does not exist</h1>
      <p className="text-muted">The link may be out of date, or the task may have been deleted.</p>
      <Link to="/" className="text-interactive font-semibold underline underline-offset-4">
        Back to the dashboard
      </Link>
    </main>
  )
}
