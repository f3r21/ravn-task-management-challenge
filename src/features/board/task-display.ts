import { assertNever } from '@/lib/assert-never'
import { PointEstimate, Status, TaskTag } from './task-types'

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
    case Status.Backlog:
      return 'Backlog'
    case Status.Todo:
      return 'Todo'
    case Status.InProgress:
      return 'In Progress'
    case Status.Done:
      return 'Done'
    case Status.Cancelled:
      return 'Cancelled'
    default:
      return assertNever(status, 'status')
  }
}

export function tagLabel(tag: TaskTag): string {
  switch (tag) {
    case TaskTag.Android:
      return 'Android'
    case TaskTag.Ios:
      return 'iOS app'
    case TaskTag.NodeJs:
      return 'Node js'
    case TaskTag.Rails:
      return 'Rails'
    case TaskTag.React:
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
    case TaskTag.Ios:
      return 'green'
    case TaskTag.Android:
      return 'amber'
    case TaskTag.React:
      return 'red'
    case TaskTag.NodeJs:
    case TaskTag.Rails:
      return 'neutral'
    default:
      return assertNever(tag, 'tag')
  }
}

/** The numeric value behind a point estimate, for display as "4 Points". */
export function pointValue(estimate: PointEstimate): number {
  switch (estimate) {
    case PointEstimate.Zero:
      return 0
    case PointEstimate.One:
      return 1
    case PointEstimate.Two:
      return 2
    case PointEstimate.Four:
      return 4
    case PointEstimate.Eight:
      return 8
    default:
      return assertNever(estimate, 'point estimate')
  }
}

export function pointsLabel(estimate: PointEstimate): string {
  return `${String(pointValue(estimate))} Points`
}
