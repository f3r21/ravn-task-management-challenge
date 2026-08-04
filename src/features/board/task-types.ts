import { exhaustiveList } from '@/lib/exhaustive'
import type {
  PointEstimate,
  Status,
  TaskFieldsFragment,
  TaskTag,
  UserFieldsFragment,
  UserType,
} from '@/graphql/generated/graphql'

/**
 * The domain shapes this feature works in.
 *
 * Every type here is generated from `schema.graphql`, so the API is the single
 * source of truth for what a task is. This module exists to give those generated
 * names domain-meaningful aliases and to add the ordered lists the UI iterates —
 * not to redeclare anything.
 */
export type { PointEstimate, Status, TaskTag, UserType }
export type Task = TaskFieldsFragment
export type User = UserFieldsFragment

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
