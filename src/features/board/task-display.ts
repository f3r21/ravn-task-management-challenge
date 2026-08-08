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
 */

/**
 * What this app's own chips still need on top of `@ravn/ui-kit`'s `Tag`.
 *
 * `whitespace-nowrap` is for the due-date badge, whose content is a spelled-out
 * date: without it "Yesterday" and friends break across as many as three lines in
 * a narrow column. The kit's `Tag` merges `className` last, which is what makes
 * this work at all.
 *
 * `uppercase` is here for the same reason it always was — the labels are stored in
 * natural case *because* CSS uppercases them, so a screen reader reads "iOS app"
 * rather than spelling out capitals — but **it is no longer this constant's job on
 * the board.** `@ravn/ui-kit@v0.7.0` renders `TaskCard`'s and `TagCell`'s chips
 * `uppercase` itself (ravn-ui-kit#102), without touching the label string. That is
 * the fix, and it arrived because migrating onto the kit's card in app#31 dropped
 * the casing: `tags` was `{ label, variant }[]` with no styling channel, so the
 * board rendered "iOS app" while this row rendered "IOS APP" for about a day.
 *
 * **Measure that class of change in a browser, never in jsdom.** The test
 * environment loads no Tailwind, so `getComputedStyle(...).textTransform` answers
 * `none` in *both* views and cannot tell a correct build from a broken one — every
 * test passed throughout, because they query the stored text and the stored text was
 * never what changed. Against a production build the chip now reports
 * `textTransform: uppercase` with `textContent` still `"Android"`, in both views.
 *
 * The kit's per-chip `className` (`TaskTag`) is the opt-out if a consumer ever wants
 * the old rendering — `className: 'normal-case'`. This app does not: caps are what
 * Figma draws, which is why #102 was filed rather than worked around here.
 */
export const TAG_TEXT = 'uppercase whitespace-nowrap'

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
 * Two are fixed by the mockup, which draws `iOS app` in green and `Android` in
 * yellow. The remaining three fall out naturally: React and Rails take the blue
 * and red of their own brands, leaving Node js on the neutral chip.
 */
export function tagAccent(tag: TaskTag): AccentColor {
  switch (tag) {
    case 'IOS':
      return 'green'
    case 'ANDROID':
      return 'yellow'
    case 'REACT':
      return 'blue'
    case 'RAILS':
      return 'red'
    case 'NODE_JS':
      return 'neutral'
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
