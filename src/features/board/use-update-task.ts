import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { request } from '@/graphql/client'
import { UpdateTaskDocument, type UpdateTaskInput } from '@/graphql/generated/graphql'
import type { Task } from './task-types'
import { taskKeys } from './use-tasks'

/**
 * Updates a task and refreshes every cached list.
 *
 * `UpdateTaskInput` is a patch: only the fields present are applied, so a caller
 * changing just the status does not have to resend the name and risk clobbering
 * an edit someone else made in between.
 */
export function useUpdateTask(): UseMutationResult<Task, Error, UpdateTaskInput> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateTaskInput) => {
      const data = await request(UpdateTaskDocument, { input })
      return data.updateTask
    },
    onSuccess: () => {
      // Not awaited — see `use-create-task.ts` for why. The saved change reaches
      // the board through the refetch either way; awaiting only delays the dialog
      // closing behind it.
      void queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
