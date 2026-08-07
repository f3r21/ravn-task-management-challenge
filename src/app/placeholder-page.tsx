import { EmptyState } from '@/ui/empty-state/empty-state'

interface PlaceholderPageProps {
  /** Doubles as the heading and the nav item's label, so the two cannot disagree. */
  title: string
}

/**
 * A sidebar destination the challenge does not build.
 *
 * §2 asks the sidebar for "the list of menu navigation items", most of which "can
 * navigate to a placeholder/sample page" — wording that presupposes more items
 * than the six sections produce routes for. These are those items, and this is
 * that page.
 *
 * Deliberately not `NotFoundPage`. Its heading says the page does not exist, and
 * these do: they are named, linked, reachable, and marked `aria-current` while
 * you are on them. Sending a working nav item to "this page does not exist" would
 * read as a broken link rather than an unbuilt feature — and that heading is
 * pinned by `routes.test.tsx` as the signal for a genuinely bad URL.
 */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-body-xl font-semibold">{title}</h1>
      <EmptyState
        label={title}
        title="Nothing here yet"
        description={`${title} is a sample page. The brief asks the sidebar to list more destinations than the challenge builds, and for most of them to lead somewhere like this.`}
      />
    </main>
  )
}
