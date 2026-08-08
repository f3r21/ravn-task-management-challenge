import { Button, GridViewIcon, ListViewIcon, PlusIcon, ViewSwitcher } from '@ravn/ui-kit'

export type BoardView = 'list' | 'grid'

interface BoardToolbarProps {
  view: BoardView
  onViewChange: (view: BoardView) => void
  onCreateTask: () => void
}

/**
 * Which side of the kit's switcher each view sits on.
 *
 * `ViewSwitcher`'s `value` is **positional** — `'left' | 'right'` — and deliberately so: its
 * doc comment records that both real page instances in Figma render the identical selected
 * side, so nothing in spec ties a side to a content type. Rather than bake an unverified
 * board/list semantic into the kit, it left the meaning to the consumer. This is the consumer
 * supplying it, in the order the app already drew: list on the left, board on the right.
 *
 * A lookup in both directions rather than a cast, for the reason `select-option.tsx` gives at
 * `:41` — the values are already typed, so nothing is asserted and an unknown side cannot
 * become a `BoardView` the rest of the app then trusts.
 */
const SIDE_FOR_VIEW: Record<BoardView, 'left' | 'right'> = { list: 'left', grid: 'right' }
const VIEW_FOR_SIDE: Record<'left' | 'right', BoardView> = { left: 'list', right: 'grid' }

/**
 * The row above the board: the layout switcher on the left, create on the right.
 *
 * **The switcher is `@ravn/ui-kit`'s `ViewSwitcher` now, and this app is why it can be.** It
 * was two independent `onPress` buttons with `aria-label`s — no group, no set position, no
 * checked state, selection carried by border colour alone — which is a worse model than the
 * `useRadioGroup` this file used to hand-roll. That was filed as `ravn-ui-kit#9`'s shell half
 * and shipped: the two buttons are a `role="radiogroup"` of `role="radio"`s with `aria-checked`,
 * one tab stop for the group, and arrow plus Home/End between them.
 *
 * So the ~90 lines of `useRadio`/`useRadioGroup`/`VisuallyHidden` that used to live here are
 * gone, and the behaviour they existed to provide is unchanged. That is the whole argument for
 * the arrangement: the app proved the requirement, the kit absorbed it, and the next consumer
 * gets it for free.
 *
 * `label` names the group — "Board layout" rather than the kit's `'View'` default, which is
 * what a screen reader announces before the selected option ("Board layout, List view, radio
 * button, 1 of 2").
 */
export function BoardToolbar({ view, onViewChange, onCreateTask }: BoardToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <ViewSwitcher
        value={SIDE_FOR_VIEW[view]}
        onChange={(side) => {
          onViewChange(VIEW_FOR_SIDE[side])
        }}
        label="Board layout"
        leftIcon={<ListViewIcon className="size-[18px]" />}
        rightIcon={<GridViewIcon className="size-[18px]" />}
        leftLabel="List view"
        rightLabel="Grid view"
      />

      {/* `onPress`, not `onClick`: the kit's `Button` is built on `useButton`, so the
          press sequence is React Aria's rather than the DOM's. */}
      <Button aria-label="Create task" variant="primary" onPress={onCreateTask}>
        <PlusIcon className="size-3.5" />
      </Button>
    </div>
  )
}
