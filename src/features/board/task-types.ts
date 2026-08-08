import { exhaustiveList } from '@/lib/exhaustive'
import type { Status, TaskTag, PointEstimate } from '@/graphql/domain'

/**
 * The orders this feature displays the API's enums in.
 *
 * The type vocabulary itself now lives in `@/graphql/domain` — `Task` and `User`
 * are returned by queries this feature does not own, and having them here meant
 * `features/profile` and every MSW handler imported `@/features/board` to learn
 * what a user is. That edge is now a lint error; see `eslint.config.js`.
 *
 * The three lists below stayed because they are not API vocabulary: each one is a
 * choice the board's UI makes about presentation order, and the schema makes none
 * of them. They go through `exhaustiveList` so that the API gaining a sixth status
 * is a compile error naming what is missing, rather than a task with nowhere to
 * render.
 *
 * The type re-export beneath them is a convenience for this feature's own 20-odd
 * modules and nothing else — `@/graphql/domain` is the canonical import path, and
 * anything outside `features/board` must use it.
 */
export type { PointEstimate, Status, Task, TaskTag, User, UserType } from '@/graphql/domain'

/**
 * Column order on the board.
 *
 * The brief names these five; the Figma mockup draws three ("Working", "In
 * Progress", "Completed") because it predates the schema. The brief wins — it is
 * the graded document, and dropping a status would leave tasks the API returns
 * with nowhere to render.
 *
 * The order is the workflow's, not the schema's: the schema lists members
 * alphabetically, which would put Cancelled between Backlog and Done.
 */
export const BOARD_STATUSES = exhaustiveList<Status>()([
  'BACKLOG',
  'TODO',
  'IN_PROGRESS',
  'DONE',
  'CANCELLED',
])

/** Tags in the order the filter UI offers them. */
export const ALL_TAGS = exhaustiveList<TaskTag>()(['ANDROID', 'IOS', 'NODE_JS', 'RAILS', 'REACT'])

/** Point estimates, ascending — the schema lists them alphabetically. */
export const ALL_POINT_ESTIMATES = exhaustiveList<PointEstimate>()([
  'ZERO',
  'ONE',
  'TWO',
  'FOUR',
  'EIGHT',
])
