import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationResult,
} from '@tanstack/react-query'
import { request } from '@/graphql/client'
import { DeleteTaskDocument } from '@/graphql/generated/graphql'
import type { Task } from './task-types'
import { taskKeys } from './use-tasks'

/**
 * What `onMutate` hands `onError`, so a failed delete can be put back.
 *
 * A list of key/data pairs rather than one saved array, because `taskKeys.all`
 * prefix-matches every filter permutation the session has cached and the removal
 * below touches all of them. Restoring only the list the user is looking at would
 * put the card back on that board and leave it missing from every other cached
 * filter — a lie that surfaces the moment they clear the search box.
 */
interface DeleteRollback {
  previous: [QueryKey, Task[] | undefined][]
}

/**
 * Deletes a task, taking its card off the board before the server has answered.
 *
 * The one mutation here that is optimistic, and the asymmetry is deliberate.
 * Create and update seed the cache from the *response*, because the server owns
 * what the row becomes — the id, position and creator on create, and on update
 * whatever the patch actually resolved to. Guessing either would mean rendering a
 * task the server has not agreed to. Delete has no such unknown: the id is in
 * hand, the outcome is "gone", and there is no response to wait for — the
 * mutation returns only the id it was given.
 *
 * What this actually fixes is a visible window rather than an abstract one.
 * `useTasks` holds the previous result on screen while a refetch is in flight
 * (`placeholderData: keepPreviousData`), and until now the refetch *was* the
 * whole update path for a delete. So the confirmation dialog closed, the success
 * toast appeared, and the card the user had just confirmed deleting stayed on the
 * board until the refetch settled. Removing it here closes that window at the
 * dialog instead of at the network.
 */
export function useDeleteTask(): UseMutationResult<{ id: string }, Error, string, DeleteRollback> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const data = await request(DeleteTaskDocument, { input: { id } })
      return data.deleteTask
    },
    onMutate: async (id) => {
      // Mandatory, not hygiene: a refetch already in flight — a window focus is
      // enough to start one — would settle with the task still in its response
      // and paint the card straight back. Cancelling first is what makes the
      // removal below stick.
      await queryClient.cancelQueries({ queryKey: taskKeys.all })

      // Read before the write, and from `getQueriesData` rather than from what
      // `setQueriesData` returns: that hands back the data it just wrote, which
      // is the post-removal state and worthless as a rollback.
      //
      // One snapshot per mutation, which is safe only because two deletes cannot
      // overlap here: the confirmation dialog is modal, `taskUnderAction` holds a
      // single task, and the Delete button disables itself for the duration. If a
      // second delete ever becomes reachable — a bulk action, or deleting straight
      // from the card menu — this needs revisiting, because the later `onMutate`
      // would snapshot a cache the earlier one had already edited and a rollback
      // could resurrect a task the other delete legitimately removed.
      const previous = queryClient.getQueriesData<Task[]>({ queryKey: taskKeys.all })

      queryClient.setQueriesData<Task[]>({ queryKey: taskKeys.all }, (tasks) =>
        tasks?.filter((task) => task.id !== id),
      )

      return { previous }
    },
    onError: (_error, _id, context) => {
      // Every key that was touched, not just the active one — see `DeleteRollback`.
      // The board reappears with the card on it, and `board-page.tsx` reports the
      // failure through a toast; the two together are what tell the user the
      // delete did not happen, since the card vanishing is no longer proof it did.
      //
      // A `tasks` of `undefined` here writes nothing rather than clearing the
      // entry — `setQueryData` treats an undefined value as "no update". That
      // reads like a latent bug and is the correct outcome: a key holding
      // `undefined` was mid-first-load, so the removal above (`tasks?.filter`)
      // also returned `undefined` and left it untouched. There is nothing to undo.
      // What restarts that query is the invalidation in `onSettled`.
      for (const [queryKey, tasks] of context?.previous ?? []) {
        queryClient.setQueryData(queryKey, tasks)
      }
    },
    onSettled: () => {
      // `onSettled` rather than `onSuccess`, which is where this used to live, and
      // the move is a bug fix rather than a tidy-up. `cancelQueries` above aborts
      // whatever was in flight, including a filter permutation still loading for
      // the first time — and that one has no data to roll back to. Left in
      // `onSuccess`, a *failed* delete would then strand it: cancelled, empty, and
      // with nothing scheduled to try again. Invalidating on both outcomes is what
      // restarts it.
      //
      // Started, not awaited — see `use-create-task.ts`. Awaiting it would put a
      // second round trip between the confirm press and the dialog closing, which
      // is the defect #57 removed.
      void queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
