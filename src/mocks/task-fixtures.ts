import {
  PointEstimate,
  Status,
  TaskTag,
  UserType,
  type Task,
  type User,
} from '@/features/board/task-types'

/**
 * Seed data shared by the MSW handlers and the tests.
 *
 * Written as factories rather than frozen literals so a test can say "a task
 * that is overdue" without restating the eight fields it does not care about.
 * That keeps each test's setup to the one thing it is actually about.
 */

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-1',
    fullName: 'Alicia Koch',
    email: 'alicia@ravn.co',
    avatar: null,
    type: UserType.Candidate,
    createdAt: '2026-01-04T09:00:00.000Z',
    updatedAt: '2026-01-04T09:00:00.000Z',
    ...overrides,
  }
}

export function makeTask(overrides: Partial<Task> = {}): Task {
  const creator = makeUser({ id: 'user-0', fullName: 'Marcus Chen' })
  return {
    id: 'task-1',
    name: 'Slack',
    status: Status.Todo,
    tags: [TaskTag.Ios, TaskTag.Android],
    dueDate: '2026-08-14T00:00:00.000Z',
    pointEstimate: PointEstimate.Four,
    position: 1,
    createdAt: '2026-08-01T09:00:00.000Z',
    assignee: makeUser(),
    creator,
    ...overrides,
  }
}

/** A board with something in every column, so no column is only ever empty. */
export const SEED_USERS: User[] = [
  makeUser(),
  makeUser({ id: 'user-2', fullName: 'Marcus Chen', email: 'marcus@ravn.co' }),
  makeUser({ id: 'user-3', fullName: 'Priya Nair', email: 'priya@ravn.co' }),
  makeUser({ id: 'user-4', fullName: 'Tom Rivera', email: 'tom@ravn.co', type: UserType.Admin }),
]

export const SEED_TASKS: Task[] = [
  makeTask({
    id: 'task-1',
    name: 'Slack',
    status: Status.Todo,
    tags: [TaskTag.Ios, TaskTag.Android],
    pointEstimate: PointEstimate.Four,
    dueDate: '2026-08-14T00:00:00.000Z',
    assignee: SEED_USERS[0],
  }),
  makeTask({
    id: 'task-2',
    name: 'Google',
    status: Status.Todo,
    tags: [TaskTag.Android, TaskTag.Ios, TaskTag.React],
    pointEstimate: PointEstimate.Two,
    dueDate: '2026-08-30T00:00:00.000Z',
    assignee: SEED_USERS[1],
  }),
  makeTask({
    id: 'task-3',
    name: 'Twitter',
    status: Status.InProgress,
    tags: [TaskTag.Ios, TaskTag.Android],
    pointEstimate: PointEstimate.One,
    dueDate: '2026-07-28T00:00:00.000Z',
    assignee: SEED_USERS[2],
  }),
  makeTask({
    id: 'task-4',
    name: 'Maxxis Tyres',
    status: Status.InProgress,
    tags: [TaskTag.NodeJs],
    pointEstimate: PointEstimate.Four,
    dueDate: '2026-09-06T00:00:00.000Z',
    assignee: SEED_USERS[3],
  }),
  makeTask({
    id: 'task-5',
    name: 'Samsung',
    status: Status.Backlog,
    tags: [TaskTag.Rails, TaskTag.React],
    pointEstimate: PointEstimate.Eight,
    dueDate: '2026-09-20T00:00:00.000Z',
    assignee: SEED_USERS[0],
  }),
  makeTask({
    id: 'task-6',
    name: 'Tesla',
    status: Status.Done,
    tags: [TaskTag.Ios, TaskTag.Android],
    pointEstimate: PointEstimate.Four,
    dueDate: '2026-07-30T00:00:00.000Z',
    assignee: SEED_USERS[1],
  }),
  makeTask({
    id: 'task-7',
    name: 'Netflix redesign',
    status: Status.Cancelled,
    tags: [TaskTag.React],
    pointEstimate: PointEstimate.Zero,
    dueDate: '2026-08-25T00:00:00.000Z',
    assignee: null,
  }),
]
