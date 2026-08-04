import { keepPreviousData, useQuery, type UseQueryResult } from '@tanstack/react-query'
import { request } from '@/graphql/client'
import { TasksDocument, type FilterTaskInput } from '@/graphql/generated/graphql'
import type { Task } from './task-types'

/**
 * Query keys for everything under the board.
 *
 * Centralised so an invalidation cannot miss a cache entry through a typo. The
 * create, update and delete hooks all invalidate `taskKeys.all`, which prefix-matches
 * every filtered variant of the list at once.
 */
export const taskKeys = {
  all: ['tasks'] as const,
  list: (filters: FilterTaskInput) => ['tasks', filters] as const,
}

/**
 * The board's tasks, optionally filtered.
 *
 * Filters go to the server rather than being applied to a full list here,
 * because the brief specifies the query's own filter arguments — and because
 * filtering client-side would mean fetching every task to show three.
 *
 * The filter object is part of the query key, so each combination is cached
 * separately and returning to a previous filter is instant.
 *
 * `placeholderData` keeps the previous filter's tasks on screen while the next
 * request is in flight. Without it every keystroke that settles and every filter
 * pick is a cold cache entry reporting `pending`, which replaced the whole board
 * with a skeleton and then filled it back in — the results area thrashing on
 * every interaction, which is the part of the screen the user is watching.
 *
 * It only applies once there is a previous result, so the first load still reports
 * `pending` and still shows the skeleton. A failed refetch still reports `error`,
 * because the placeholder is only substituted while the status is `pending`.
 */
export function useTasks(filters: FilterTaskInput = {}): UseQueryResult<Task[]> {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: async () => {
      const data = await request(TasksDocument, { input: filters })
      return data.tasks
    },
    placeholderData: keepPreviousData,
  })
}
