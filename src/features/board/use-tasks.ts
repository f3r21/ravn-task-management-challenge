import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { request } from '@/graphql/client'
import { TasksDocument, type FilterTaskInput } from '@/graphql/generated/graphql'
import type { Task } from './task-types'

/**
 * Query keys for everything under the board.
 *
 * Centralised so an invalidation cannot miss a cache entry through a typo — the
 * mutations in later phases invalidate `taskKeys.all`, which matches every
 * filtered variant of the list at once.
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
 */
export function useTasks(filters: FilterTaskInput = {}): UseQueryResult<Task[]> {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: async () => {
      const data = await request(TasksDocument, { input: filters })
      return data.tasks
    },
  })
}
