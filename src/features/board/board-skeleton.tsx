import { Skeleton } from '@ravn/ui-kit'
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
 * There is deliberately no live region in here. A `role="status"` that mounts with
 * its text already inside announces nothing reliably — a live region reports
 * *changes* to its contents, and a node that arrives complete has not changed. The
 * announcement is made by a region in `BoardPage` that outlives this component and
 * swaps its text instead.
 *
 * **`xl:overflow-x-auto xl:contain-paint` are here for the same reason they are on the
 * board's own `GRID_WRAPPER`, and their absence was a live defect.** "Shaped like the real
 * thing" has to include the box, not only the cards: five 348px columns need 1868px, and
 * without a scroll container and paint containment they overflowed the *document* instead
 * of this element. The whole page then scrolled sideways while the board was loading — 884px
 * at 1280, 564 at 1600, 244 at 1920 — sliding the sidebar and the header off screen, exactly
 * as `#142` describes for the board and `#144` for the list view. Transient, so it needed a
 * slow `Tasks` response to be seen at all, which is why it outlived both of those fixes.
 *
 * `xl:pb-2` comes along for parity rather than for the defect: it is what reserves room for
 * the horizontal scrollbar on the board, and a skeleton whose box differs from the board's
 * is the layout shift this component exists to avoid.
 */
export function BoardSkeleton() {
  return (
    <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 xl:flex xl:flex-row xl:overflow-x-auto xl:contain-paint xl:pb-2">
      {BOARD_STATUSES.map((status, index) => (
        <div key={status} className="flex min-w-0 flex-col gap-4 xl:w-87 xl:shrink-0">
          <Skeleton className="h-8 w-40" />
          {Array.from({ length: CARDS_PER_COLUMN[index] }, (_, cardIndex) => (
            <Skeleton key={cardIndex} className="rounded-sm h-52 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
