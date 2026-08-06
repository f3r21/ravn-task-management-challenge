import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { request } from '@/graphql/client'
import { UpdateTaskDocument, type UpdateTaskInput } from '@/graphql/generated/graphql'
import type { Task } from './task-types'
import { taskKeys } from './use-tasks'

/**
 * Updates a task, writing the saved task straight into every cached list.
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
    onSuccess: (saved) => {
      // Seeded from the response, not left to the refetch below.
      //
      // `mutateAsync` resolves as soon as this returns, and the caller closes its
      // dialog and shows its toast immediately after — while the refetch is still
      // in flight. `useTasks` holds the previous result on screen through that
      // window (`placeholderData: keepPreviousData`), so without this the board
      // would still be rendering the *pre-save* card: mounted, clickable, and
      // seeding the edit form from a Task the server has already replaced. Edit it
      // again inside that window and the form resends the stale name, silently
      // reverting a rename the server had accepted — no error, two success toasts,
      // and the board settling back on the old name.
      //
      // Writing the response in closes that window at the mutation's own round
      // trip instead of the refetch's, so the board is never a stale editable
      // target and the dialog still does not wait on a second request.
      //
      // `taskKeys.all` prefix-matches every filter permutation, so this also
      // touches lists the saved task may no longer belong to — rename a task out
      // of the current `?name=` match and its card lingers there until the refetch
      // reconciles. Deliberate: deciding here which lists it still matches would
      // mean a second implementation of the server's filter rules, undocumented in
      // the schema, free to disagree with the real one. A card that outlives its
      // filter by one round trip is a far smaller lie than a card showing a name
      // the server no longer has.
      queryClient.setQueriesData<Task[]>({ queryKey: taskKeys.all }, (tasks) =>
        tasks?.map((task) => (task.id === saved.id ? saved : task)),
      )
      // Reconciliation now rather than the update path itself — it drops the
      // lingering non-matches above and picks up anything else that moved. Started,
      // not awaited: see `use-create-task.ts` for why nothing waits on it.
      void queryClient.invalidateQueries({ queryKey: taskKeys.all })
    },
  })
}
