import type { AccentColor } from '@ravn/ui-kit'
import { assertNever } from '@/lib/assert-never'
import type { PointEstimate, Status, TaskTag } from './task-types'

/**
 * Turning API enums into the words and colours the design shows.
 *
 * Every function here closes its `switch` with `assertNever`, so adding a member
 * to any of these unions — the API gaining a sixth status, say — becomes a
 * compile error listing exactly which mappings still need a case, instead of a
 * card silently rendering a raw `IN_PROGRESS` in the UI.
 *
 * Labels are stored in the case the design *reads* as, not the case it *renders*
 * as: the mockup shows "IOS APP" and "ANDROID" in caps, but that is
 * `text-transform` in CSS. Keeping the strings in natural case means a test can
 * query by the text a user would say, and a screen reader does not spell out
 * capitals letter by letter.
 *
 * **The CSS is `@ravn/ui-kit`'s now, not this app's.** `TaskCard` and `TagCell`
 * uppercase their own chips since `v0.7.0` (ravn-ui-kit#102), which is why the
 * `TAG_TEXT` constant that used to live here is gone — every one of its call sites
 * went with the app-owned card and row. The kit's fix is a class and never
 * `label.toUpperCase()`, for exactly the reason above, so the contract these labels
 * rely on is unchanged and is now stated in two repositories instead of one.
 */

export function statusLabel(status: Status): string {
  switch (status) {
    case 'BACKLOG':
      return 'Backlog'
    case 'TODO':
      return 'Todo'
    case 'IN_PROGRESS':
      return 'In Progress'
    case 'DONE':
      return 'Done'
    case 'CANCELLED':
      return 'Cancelled'
    default:
      return assertNever(status, 'status')
  }
}

export function tagLabel(tag: TaskTag): string {
  switch (tag) {
    case 'ANDROID':
      return 'Android'
    case 'IOS':
      return 'iOS app'
    case 'NODE_JS':
      return 'Node js'
    case 'RAILS':
      return 'Rails'
    case 'REACT':
      return 'React'
    default:
      return assertNever(tag, 'tag')
  }
}

/**
 * Which accent a tag chip uses.
 *
 * The design system's Tag component defines exactly five types — General,
 * Green, Blue, Yellow, Red — and the API defines exactly five tags, so this is
 * a one-to-one assignment with nothing invented.
 *
 * **The assignment is brand-derived, and that is a deliberate deviation from the
 * mockup rather than a mistake.** The mockup draws `iOS app` in green and
 * `Android` in yellow. The repo owner was shown that trade-off in writing and
 * chose colours that mean something, so those two swap: Android takes the green
 * of its own brand, and iOS takes the neutral chip, which is close enough to
 * Apple's silver to read as intended. React and Rails were already their own
 * blue and red and do not move. Recorded here because a reader comparing this
 * against the Figma file should find the deviation, not discover it.
 *
 * **Node js on yellow is a forced choice, not a brand match.** Node's `#8CC84B`
 * is a green, and the palette has exactly one green, which Android has taken.
 * Yellow is the nearest remaining chip only because `#8CC84B` is a yellow-green
 * — it is chosen by elimination, and nothing here claims `#E5B454` resembles it.
 * A second green in the palette is what would reopen this.
 *
 * The palette values behind those comparisons, from a clone of the kit, which is
 * where they were actually read:
 *
 *     git show v0.8.0:dist/theme.css | grep -E 'secondary-4|tertiary-4|neutral-2:'
 *     #   --color-neutral-2: #94979a;      (the neutral chip)
 *     #   --color-secondary-4: #70b252;    (green)
 *     #   --color-tertiary-4: #e5b454;     (yellow)
 *
 * The same three lines are in `node_modules/@ravn/ui-kit/dist/theme.css` locally,
 * which is the shorter path for anyone who has the install rather than the repo.
 *
 * Against brand: Android `#3DDC84`, Apple `#A2AAAD`, Node `#8CC84B`. Those are
 * quoted from the brands' own guidelines and no command here re-derives them.
 *
 * Nothing is missing from the kit here. `AccentColor` is documented there as
 * "a categorical accent colour … with no meaning attached to the choice", so
 * deciding what the colours mean is this app's job by design.
 */
export function tagAccent(tag: TaskTag): AccentColor {
  switch (tag) {
    case 'IOS':
      return 'neutral'
    case 'ANDROID':
      return 'green'
    case 'REACT':
      return 'blue'
    case 'RAILS':
      return 'red'
    case 'NODE_JS':
      return 'yellow'
    default:
      return assertNever(tag, 'tag')
  }
}

/** The numeric value behind a point estimate, for display as "4 Points". */
export function pointValue(estimate: PointEstimate): number {
  switch (estimate) {
    case 'ZERO':
      return 0
    case 'ONE':
      return 1
    case 'TWO':
      return 2
    case 'FOUR':
      return 4
    case 'EIGHT':
      return 8
    default:
      return assertNever(estimate, 'point estimate')
  }
}

/**
 * "4 Points", but "1 Point" — the one estimate where the plural is wrong.
 *
 * Zero takes the plural, which is what English does with it ("0 Points"), so the
 * singular is the single case rather than the default.
 */
export function pointsLabel(estimate: PointEstimate): string {
  const points = pointValue(estimate)
  return `${String(points)} ${points === 1 ? 'Point' : 'Points'}`
}
