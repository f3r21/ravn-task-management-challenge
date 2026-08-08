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
 * The two things `@ravn/ui-kit`'s `Tag` does not do that this app's chips need.
 *
 * `uppercase` is load-bearing rather than cosmetic, and the paragraph above is
 * why: the labels are deliberately stored in natural case *because* CSS
 * uppercases them. Drop this and the chips read "iOS app" instead of "IOS APP" —
 * the design's casing, gone, with every test still passing because they query the
 * stored text.
 *
 * `whitespace-nowrap` is for the due-date badge, whose content is a spelled-out
 * date: without it "Yesterday" and friends break across as many as three lines in
 * a narrow column.
 *
 * The kit's `Tag` merges `className` last, which is what makes this work at all.
 *
 * **It now reaches only the list view, and that is a defect rather than a design.**
 * Both call sites are in `task-card/task-row.tsx`; the board's chips go through
 * `@ravn/ui-kit`'s `TaskCard`, whose `tags` prop is `{ label, variant }[]` with no
 * styling channel, so it renders a bare `Tag` and the `uppercase` above never reaches
 * it. The two views therefore disagree: the board reads "iOS app", the list "IOS APP".
 *
 * Measured in a browser, not in jsdom — the test environment loads no Tailwind, so
 * `getComputedStyle(...).textTransform` answers `none` in *both* views and cannot tell
 * them apart. Against `npm run dev`, one card's `innerText` reads
 * `… | Android | React | …` and the same task's row reads `… | ANDROID | REACT | …`.
 *
 * Introduced by app#31 and filed as ravn-ui-kit#102, because the fix belongs there:
 * Figma draws these chips in caps, so the kit's own card should render them that way
 * rather than every consumer re-deriving it. Not worked around here — a Tailwind
 * arbitrary variant aimed at the kit's internal DOM from the card's `className` would
 * be exactly the brittle, silently-breaking hack this project keeps refusing.
 *
 * The paragraph above predicted this failure almost word for word: *"with every test
 * still passing because they query the stored text."* Every test does still pass.
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
