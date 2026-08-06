import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { request } from '@/graphql/client'
import { CreateTaskDocument, type CreateTaskInput } from '@/graphql/generated/graphql'
import type { Task } from './task-types'
import { taskKeys } from './use-tasks'

/**
 * Creates a task, writing the created task straight into every cached list.
 *
 * Both halves reach `taskKeys.all` rather than a single key, because each filter
 * combination is cached under its own key: writing the new task into just the
 * unfiltered list would leave a filtered view stale, and the user would create a
 * task while a filter is on and watch nothing happen.
 *
 * Still no optimistic update — the card that appears is the server's own row,
 * with the id, position and creator it assigned, not a guess made before the
 * request and reconciled after it. The button stays pending until the response
 * arrives; what changed is that the board is correct the moment it stops.
 */
export function useCreateTask(): UseMutationResult<Task, Error, CreateTaskInput> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const data = await request(CreateTaskDocument, { input })
      return data.createTask
    },
    onSuccess: (created) => {
      // Seeded from the response, not left to the refetch below.
      //
      // `mutateAsync` resolves as soon as this returns, so the dialog closes and
      // "Task created" appears while the refetch is still in flight — and
      // `useTasks` holds the previous result on screen through it. On an empty
      // board that put the success toast next to an empty state still reading "No
      // tasks yet", for a full round trip, every single time. The natural reading
      // is that the create did not take, which invites the user to do it again.
      //
      // Same prefix-match tradeoff as `use-update-task.ts`: `taskKeys.all` covers
      // every filter permutation, so a task created while a filter is on appears
      // in lists it may not match until the refetch drops it again. Deliberate —
      // re-deriving the server's filter rules here would be a second, divergent
      // copy of semantics the schema does not document.
      queryClient.setQueriesData<Task[]>({ queryKey: taskKeys.all }, (tasks) => {
        if (!tasks) {
          return undefined
        }
        // A refetch already in flight when the response landed — window focus
        // starts one — can settle with the new task already in it. Prepending
        // blind would then render the same id twice.
        return tasks.some((task) => task.id === created.id) ? tasks : [created, ...tasks]
      })
      // Started, not awaited. `mutateAsync` does not resolve until `onSuccess`
      // does, and `invalidateQueries` resolves only once the refetch has settled —
      // so awaiting it put a second round trip between the Create press and the
      // dialog closing, and the board sat under a disabled button for both. With
      // the seed above the refetch is reconciliation rather than the update path,
      // so nothing on screen is waiting for it.
      void queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
