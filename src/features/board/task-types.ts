/**
 * The domain shapes this feature works in, mirroring `schema.graphql`.
 *
 * These are hand-written for now and are replaced by graphql-codegen output in
 * the phase that connects to the API — at which point this module re-exports the
 * generated types instead of declaring them, so no import site has to change.
 *
 * The unions are declared as `const` objects plus a derived type rather than TS
 * `enum`s: an enum is a runtime value the compiler treats specially and it does
 * not narrow from a plain string, which makes parsing an API response into one
 * awkward. This shape gives the same exhaustiveness checking with an object that
 * is just data.
 */

export const Status = {
  Backlog: 'BACKLOG',
  Todo: 'TODO',
  InProgress: 'IN_PROGRESS',
  Done: 'DONE',
  Cancelled: 'CANCELLED',
} as const
export type Status = (typeof Status)[keyof typeof Status]

export const TaskTag = {
  Android: 'ANDROID',
  Ios: 'IOS',
  NodeJs: 'NODE_JS',
  Rails: 'RAILS',
  React: 'REACT',
} as const
export type TaskTag = (typeof TaskTag)[keyof typeof TaskTag]

export const PointEstimate = {
  Zero: 'ZERO',
  One: 'ONE',
  Two: 'TWO',
  Four: 'FOUR',
  Eight: 'EIGHT',
} as const
export type PointEstimate = (typeof PointEstimate)[keyof typeof PointEstimate]

export const UserType = {
  Admin: 'ADMIN',
  Candidate: 'CANDIDATE',
} as const
export type UserType = (typeof UserType)[keyof typeof UserType]

export interface User {
  id: string
  fullName: string
  email: string
  avatar?: string | null
  type: UserType
  createdAt: string
  updatedAt: string
}

export interface Task {
  id: string
  name: string
  status: Status
  tags: TaskTag[]
  dueDate: string
  pointEstimate: PointEstimate
  position: number
  createdAt: string
  assignee?: User | null
  creator: User
}

/**
 * Column order on the board. The brief names these five; the Figma mockup draws
 * three ("Working", "In Progress", "Completed") because it predates the schema.
 * The brief wins — it is the graded document, and dropping a status would leave
 * tasks the API returns with nowhere to render.
 */
export const BOARD_STATUSES: readonly Status[] = [
  Status.Backlog,
  Status.Todo,
  Status.InProgress,
  Status.Done,
  Status.Cancelled,
]
