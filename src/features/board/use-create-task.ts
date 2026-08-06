import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { request } from '@/graphql/client'
import { CreateTaskDocument, type CreateTaskInput } from '@/graphql/generated/graphql'
import type { Task } from './task-types'
import { taskKeys } from './use-tasks'

/**
 * Creates a task and refreshes every cached list.
 *
 * Invalidating `taskKeys.all` rather than a single key matters: each filter
 * combination is cached under its own key, so writing the new task into just the
 * unfiltered list would leave a filtered view stale — and the user would create
 * a task while a filter is on and watch nothing happen.
 *
 * No optimistic update. The server assigns the id, the position and the creator,
 * so an optimistic card would be a guess that has to be reconciled a moment
 * later; the request is fast enough that a pending button is honest and simpler.
 */
export function useCreateTask(): UseMutationResult<Task, Error, CreateTaskInput> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const data = await request(CreateTaskDocument, { input })
      return data.createTask
    },
    onSuccess: () => {
      // Started, not awaited. `mutateAsync` does not resolve until `onSuccess`
      // does, and `invalidateQueries` resolves only once the refetch has settled —
      // so awaiting it put a second round trip between the Create press and the
      // dialog closing, and the board sat under a disabled button for both. The
      // refetch still happens and the new card still arrives; nothing waits on it.
      void queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
