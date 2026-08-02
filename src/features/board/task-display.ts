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
 * The design specifies colours for exactly two tags — `iOS app` green and
 * `Android` amber — because those are the only two its mockup draws. The other
 * three are mapped onto the remaining accents the design system does define
 * rather than onto invented hex values, so every colour on screen still traces
 * back to a token that came out of Figma.
 */
export type TagAccent = 'green' | 'amber' | 'red' | 'neutral'

export function tagAccent(tag: TaskTag): TagAccent {
  switch (tag) {
    case 'IOS':
      return 'green'
    case 'ANDROID':
      return 'amber'
    case 'REACT':
      return 'red'
    case 'NODE_JS':
    case 'RAILS':
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
