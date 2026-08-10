import { Skeleton } from '@ravn/ui-kit'
import { GRID_COLUMN, GRID_WRAPPER } from './board'
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
 * **The box comes from `board.tsx` rather than being retyped here, and that is the fix for a
 * defect this file shipped.** "Shaped like the real thing" has to include the box, not only
 * the cards: five 348px columns need 1868px, and this element had neither the board's scroll
 * container nor its paint containment, so those 1868px overflowed the *document*. The whole
 * page scrolled sideways while the board was loading — 884px at 1280, 564 at 1600, 244 at
 * 1920 — sliding the sidebar and the header off screen, exactly as `#142` describes for the
 * board and `#144` for the list view. It is transient, needing a slow `Tasks` response to be
 * visible at all, which is why it outlived both of those fixes.
 *
 * Importing `GRID_WRAPPER` is deliberate and not tidiness. The first version of this fix
 * pasted the board's class string in, which made the two character-identical *and* left
 * nothing to keep them that way — the same arrangement that let them drift in the first
 * place. A comment promising parity is not a mechanism.
 *
 * `GRID_COLUMN` is shared for the same reason. The `flex min-w-0 flex-col gap-4` beside it is
 * not: that mirrors what the kit's `TaskListView` lays out internally, which this file can
 * only approximate, so there is no app-side constant for it to share.
 */
export function BoardSkeleton() {
  return (
    <div className={GRID_WRAPPER}>
      {BOARD_STATUSES.map((status, index) => (
        <div key={status} className={`flex min-w-0 flex-col gap-4 ${GRID_COLUMN}`}>
          <Skeleton className="h-8 w-40" />
          {Array.from({ length: CARDS_PER_COLUMN[index] }, (_, cardIndex) => (
            <Skeleton key={cardIndex} className="rounded-sm h-52 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}
