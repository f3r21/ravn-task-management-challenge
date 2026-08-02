import { graphql, HttpResponse, type RequestHandler } from 'msw'
import type {
  CreateTaskMutationVariables,
  DeleteTaskMutationVariables,
  TasksQueryVariables,
  UpdateTaskMutationVariables,
} from '@/graphql/generated/graphql'
import { taskStore } from './task-store'

/**
 * MSW handlers standing in for the challenge API.
 *
 * These back the dev server whenever no token is configured *and* the whole test
 * suite, so there is one source of fake truth and the client code under test is
 * the real client code. Pointing `VITE_API_URL` and `VITE_API_TOKEN` at RAVN's
 * endpoint bypasses them entirely — nothing in `src/features` changes.
 *
 * They delegate to `taskStore`, which behaves like a server: a created task
 * shows up in the next query, filters genuinely narrow, a delete removes. A
 * handler returning a fixed list would let a broken cache invalidation pass.
 *
 * Matching is by operation name rather than URL, so the same handlers work
 * against the mock host and against RAVN's if a test ever points at it.
 */

/**
 * The response body shape both branches below return, so a resolver that can
 * answer with either data or an error still has one return type.
 */
interface MockGraphQLBody {
  data?: Record<string, unknown> | null
  errors?: { message: string; extensions?: Record<string, unknown> }[]
}

/** GraphQL reports a missing entity in the errors array, not as a 404. */
function notFound(message: string) {
  return HttpResponse.json<MockGraphQLBody>({
    errors: [{ message, extensions: { code: 'NOT_FOUND' } }],
  })
}

export const handlers: RequestHandler[] = [
  graphql.query<Record<string, unknown>, TasksQueryVariables>('Tasks', ({ variables }) =>
    HttpResponse.json({ data: { tasks: taskStore.listTasks(variables.input) } }),
  ),

  graphql.query('Users', () => HttpResponse.json({ data: { users: taskStore.listUsers() } })),

  graphql.query('Profile', () => HttpResponse.json({ data: { profile: taskStore.profile() } })),

  graphql.mutation<Record<string, unknown>, CreateTaskMutationVariables>(
    'CreateTask',
    ({ variables }) =>
      HttpResponse.json({ data: { createTask: taskStore.createTask(variables.input) } }),
  ),

  graphql.mutation<Record<string, unknown>, UpdateTaskMutationVariables>(
    'UpdateTask',
    ({ variables }) => {
      const updated = taskStore.updateTask(variables.input)
      return updated
        ? HttpResponse.json<MockGraphQLBody>({ data: { updateTask: updated } })
        : notFound('No task with that id')
    },
  ),

  graphql.mutation<Record<string, unknown>, DeleteTaskMutationVariables>(
    'DeleteTask',
    ({ variables }) => {
      const deleted = taskStore.deleteTask(variables.input)
      return deleted
        ? HttpResponse.json<MockGraphQLBody>({ data: { deleteTask: { id: deleted.id } } })
        : notFound('No task with that id')
    },
  ),
]
