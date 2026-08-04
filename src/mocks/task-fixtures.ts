import type { Task, User } from '@/features/board/task-types'

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
    type: 'CANDIDATE',
    createdAt: '2026-01-04T09:00:00.000Z',
    updatedAt: '2026-01-04T09:00:00.000Z',
    ...overrides,
  }
}

export function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    name: 'Slack',
    status: 'TODO',
    tags: ['IOS', 'ANDROID'],
    dueDate: '2026-08-14T00:00:00.000Z',
    pointEstimate: 'FOUR',
    position: 1,
    createdAt: '2026-08-01T09:00:00.000Z',
    assignee: makeUser(),
    // A creator drawn from the same directory the `users` query returns. This used
    // to be `user-0`, an id absent from `SEED_USERS`, and since no seed task
    // overrode it *every* task had a creator who did not exist — so the owner
    // filter matched nothing for every name its picker offered.
    creator: makeUser({ id: 'user-2', fullName: 'Marcus Chen', email: 'marcus@ravn.co' }),
    ...overrides,
  }
}

export const SEED_USERS: User[] = [
  makeUser(),
  makeUser({ id: 'user-2', fullName: 'Marcus Chen', email: 'marcus@ravn.co' }),
  makeUser({ id: 'user-3', fullName: 'Priya Nair', email: 'priya@ravn.co' }),
  makeUser({ id: 'user-4', fullName: 'Tom Rivera', email: 'tom@ravn.co', type: 'ADMIN' }),
]

/** A board with something in every column, so no column is only ever empty. */
export const SEED_TASKS: Task[] = [
  makeTask({
    id: 'task-1',
    name: 'Slack',
    status: 'TODO',
    tags: ['IOS', 'ANDROID'],
    pointEstimate: 'FOUR',
    dueDate: '2026-08-14T00:00:00.000Z',
    assignee: SEED_USERS[0],
    creator: SEED_USERS[0],
  }),
  makeTask({
    id: 'task-2',
    name: 'Google',
    status: 'TODO',
    tags: ['ANDROID', 'IOS', 'REACT'],
    pointEstimate: 'TWO',
    dueDate: '2026-08-30T00:00:00.000Z',
    assignee: SEED_USERS[1],
    creator: SEED_USERS[1],
  }),
  makeTask({
    id: 'task-3',
    name: 'Twitter',
    status: 'IN_PROGRESS',
    tags: ['IOS', 'ANDROID'],
    pointEstimate: 'ONE',
    dueDate: '2026-07-28T00:00:00.000Z',
    assignee: SEED_USERS[2],
    creator: SEED_USERS[0],
  }),
  makeTask({
    id: 'task-4',
    name: 'Maxxis Tyres',
    status: 'IN_PROGRESS',
    tags: ['NODE_JS'],
    pointEstimate: 'FOUR',
    dueDate: '2026-09-06T00:00:00.000Z',
    assignee: SEED_USERS[3],
    creator: SEED_USERS[2],
  }),
  makeTask({
    id: 'task-5',
    name: 'Samsung',
    status: 'BACKLOG',
    tags: ['RAILS', 'REACT'],
    pointEstimate: 'EIGHT',
    dueDate: '2026-09-20T00:00:00.000Z',
    assignee: SEED_USERS[0],
    creator: SEED_USERS[1],
  }),
  makeTask({
    id: 'task-6',
    name: 'Tesla',
    status: 'DONE',
    tags: ['IOS', 'ANDROID'],
    pointEstimate: 'FOUR',
    dueDate: '2026-07-30T00:00:00.000Z',
    assignee: SEED_USERS[1],
    creator: SEED_USERS[3],
  }),
  makeTask({
    id: 'task-7',
    name: 'Netflix redesign',
    status: 'CANCELLED',
    tags: ['REACT'],
    pointEstimate: 'ZERO',
    dueDate: '2026-08-25T00:00:00.000Z',
    assignee: null,
    creator: SEED_USERS[0],
  }),
]
