import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { request } from '@/graphql/client'
import { DeleteTaskDocument } from '@/graphql/generated/graphql'
import { taskKeys } from './use-tasks'

/**
 * Deletes a task and refreshes every cached list.
 *
 * The mutation returns only the deleted id — that is all the schema exposes —
 * so there is nothing to write into the cache and invalidation is the whole
 * update path.
 */
export function useDeleteTask(): UseMutationResult<{ id: string }, Error, string> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const data = await request(DeleteTaskDocument, { input: { id } })
      return data.deleteTask
    },
    onSuccess: () => {
      // Not awaited — see `use-create-task.ts` for why. The confirmation dialog
      // would otherwise stay open, with its Delete button disabled, for a whole
      // extra round trip after the task was already gone.
      void queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
