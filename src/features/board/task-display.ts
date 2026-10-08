import type { AccentColor } from '@ravn/ui-kit'
import { assertNever } from '@/lib/assert-never'
import type { PointEstimate, Status, TaskTag } from './task-types'

/**
 * Turning API values into the words and colours the board shows.
 *
 * Every function here that maps an enum closes its `switch` with `assertNever`,
 * so adding a member to any of these unions — the API gaining a sixth status,
 * say — becomes a compile error listing exactly which mappings still need a
 * case, instead of a card silently rendering a raw `IN_PROGRESS` in the UI.
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
 * mockup rather than a mistake.** The repo owner was shown the trade-off in
 * writing and chose colours that mean something, so Android takes the green of
 * its own brand and iOS takes the neutral chip, whose grey is within a shade of
 * Apple's silver. React and Rails were already their own blue and red and do not
 * move.
 *
 * What was deviated *from* is recorded here so a reader comparing this against
 * Figma finds the deviation rather than discovering it: the mockup draws
 * `iOS app` in green and `Android` in yellow. **Checked, in the design vault
 * that is not part of this repo** — `UI-Kit/Mockups/Dashboard Default View/`,
 * whose embedded board image shows every card carrying `IOS APP` green and
 * `ANDROID` amber. Those are also the only two tags the mockup draws, which is
 * why the original mapping described exactly two as fixed by it.
 *
 * **No grep re-derives that, and the reason is worth knowing before you try.**
 * The tag exports are Figma CSS dumps naming only the component's five variant
 * types — `Type=Green`, `Type=Yellow` — and they never bind a label to one; the
 * pairing exists solely in the pasted raster beside them. A search for `rails`
 * across the whole corpus returns 0 while `3 Pts` returns 25, so the grep reads
 * fine and the labels are genuinely not there as text. Open the image. Do not
 * search for it, and do not conclude from a silent search that nothing was
 * drawn.
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

/** The number behind a point estimate. `effortLabel` turns it into words. */
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
 * How a person reads a point estimate: "Effort 4".
 *
 * The one place that owns this wording, so no two places that show it can drift
 * apart. People who are not developers read "points" as priority, so the word is
 * Effort.
 *
 * It takes the number, not the `PointEstimate` enum. That also makes it a kit
 * `PointsFormatter`, which fits the `formatPoints` prop of `TaskCard` and the table
 * row with no wrapper. Code that holds the enum goes through `pointValue` first.
 *
 * Every value reads the same way, 0 and 1 included. The word comes before the
 * number, so there is no plural to get wrong.
 */
export function effortLabel(points: number): string {
  return `Effort ${String(points)}`
}

/**
 * The line shown under the effort field, which is also its accessible description.
 *
 * It says what the field is not, because people new to it read it as priority. It
 * also says which end of the scale is small.
 */
export const EFFORT_HELP = 'How much work it takes, not how urgent it is. 0 = tiny, 8 = big.'
