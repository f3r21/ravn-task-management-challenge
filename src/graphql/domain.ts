import type {
  PointEstimate,
  Status,
  TaskFieldsFragment,
  TaskTag,
  UserFieldsFragment,
  UserType,
} from './generated/graphql'

/**
 * The API's vocabulary, under domain-meaningful names.
 *
 * Every type here is generated from `schema.graphql`, so the API stays the single
 * source of truth for what a task and a user are. This module only *aliases* those
 * generated names — nothing is redeclared, and a schema change still arrives as a
 * compile error rather than as two shapes drifting apart.
 *
 * It sits in `graphql/` rather than in a feature because of who needs it. `User` is
 * `UserFieldsFragment`, returned by the `Users`, `Profile` **and** `Tasks` queries —
 * it is not a board concept, yet `features/profile` and the whole of `mocks/` used
 * to reach into `@/features/board/task-types` to learn what a user is. Deleting
 * `features/board` would have stopped the MSW handlers compiling, which is the
 * clearest possible statement that the type was in the wrong place.
 *
 * What deliberately did *not* move here: `BOARD_STATUSES`, `ALL_TAGS` and
 * `ALL_POINT_ESTIMATES` (`features/board/task-types.ts`). Those are orderings the
 * board's UI chooses — column order is the workflow's, not the schema's, which
 * lists its members alphabetically — so they are board policy rather than API
 * vocabulary, and `graphql/` is the wrong home for a decision the API does not make.
 */
export type { PointEstimate, Status, TaskTag, UserType }
export type Task = TaskFieldsFragment
export type User = UserFieldsFragment
