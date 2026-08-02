import { Skeleton } from '@/ui/skeleton/skeleton'
import { BOARD_STATUSES } from './task-types'

/** How many placeholder cards each column shows while the board loads. */
const CARDS_PER_COLUMN = [2, 3, 2, 1, 1]

/**
 * The board's loading state.
 *
 * Skeletons rather than a spinner, and skeletons shaped like the real thing:
 * five columns, cards at the height a task card actually renders at. The layout
 * that appears is the layout that stays, so nothing jumps when data arrives.
 *
 * The status message is what assistive tech gets. `role="status"` announces it
 * politely without stealing focus, and it is replaced by the board itself on
 * success — so "loading" is never left announced after loading finishes.
 */
export function BoardSkeleton() {
  return (
    <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 xl:flex xl:flex-row">
      <p role="status" className="sr-only">
        Loading tasks
      </p>
      {BOARD_STATUSES.map((status, index) => (
        <div key={status} className="flex min-w-0 flex-col gap-4 xl:w-87 xl:shrink-0">
          <Skeleton className="h-8 w-40" />
          {Array.from({ length: CARDS_PER_COLUMN[index] }, (_, cardIndex) => (
            <Skeleton key={cardIndex} className="rounded-card h-52 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
