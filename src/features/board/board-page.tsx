import { useMemo, useState } from 'react'
import { useOverlayTriggerState } from 'react-stately'
import { ApiError } from '@/graphql/client'
import { parseApiDate, toDateInputValue } from '@/lib/due-date'
import { isUsingMockApi } from '@/lib/env'
import { Button } from '@/ui/button/button'
import { EmptyState } from '@/ui/empty-state/empty-state'
import { useToast } from '@/ui/toast/toast-context'
import { Board } from './board'
import { BoardSkeleton } from './board-skeleton'
import { BoardFiltersBar } from './board-filters'
import { BoardToolbar, type BoardView } from './board-toolbar'
import { DeleteTaskDialog } from './delete-task-dialog'
import { TaskFormDialog } from './task-form-dialog'
import type { TaskFormFields } from './task-form-state'
import type { Task } from './task-types'
import { useBoardFilters } from './use-board-filters'
import { useCreateTask } from './use-create-task'
import { useDeleteTask } from './use-delete-task'
import { useTasks } from './use-tasks'
import { useUpdateTask } from './use-update-task'
import { useUsers } from './use-users'

/**
 * A failure the user can act on.
 *
 * A rejected token and an unreachable server need different words: one is
 * something they can fix in `.env`, the other is worth retrying. Showing
 * "something went wrong" for both would leave them retrying a request that will
 * never succeed.
 */
function BoardError({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const isAuth = error instanceof ApiError && error.isUnauthenticated
  const message =
    error instanceof ApiError ? error.message : 'Could not load tasks. Please try again.'

  return (
    <div role="alert" className="flex flex-col items-center gap-4 py-16 text-center">
      <p className="text-body-l font-semibold">Could not load the board</p>
      <p className="text-muted text-body-m max-w-md">{message}</p>
      {isAuth ? null : (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-sm bg-interactive text-body-m px-4 py-2 font-semibold"
        >
          Try again
        </button>
      )}
    </div>
  )
}

/**
 * What the board is currently doing, for assistive tech.
 *
 * One region, mounted for the life of the page, whose *text* changes — not a
 * message rendered inside whichever state component happens to be on screen. A
 * live region announces changes to its contents, so a fresh `role="status"` that
 * arrives with its text already in it announces nothing at all; that is the usual
 * reason a loading message is silent.
 */
function boardStatusMessage(status: 'pending' | 'error' | 'success', count: number): string {
  if (status === 'pending') {
    return 'Loading tasks'
  }
  if (status === 'error') {
    // The failure itself is announced by the `role="alert"` in `BoardError`;
    // repeating it here would say it twice.
    return ''
  }
  return count === 0 ? 'No tasks to show' : `${String(count)} tasks loaded`
}

export function BoardPage() {
  const [view, setView] = useState<BoardView>('grid')
  // `status` as well as `data`, because the three outcomes need telling apart. An
  // errored `Users` query and a still-loading one both leave `data` undefined, and
  // treating them alike is what let a failed directory disable owner validation
  // permanently — see `readOwner`. It is also the only thing that can put the
  // failure on screen: with `data` alone the owner filter just renders empty, and
  // the assignee picker just offers "Unassigned", explaining neither.
  const { data: users, status: usersStatus } = useUsers()
  // The owner ids are handed to the filters so an `?owner=` that nobody matches is
  // dropped rather than sent on, the same as a bad status or tag.
  const ownerIds = useMemo(() => (users ?? []).map((user) => user.id), [users])
  const { filters, queryInput, setFilter, clearAll, isFiltered } = useBoardFilters(
    ownerIds,
    usersStatus === 'pending' ? 'pending' : 'ready',
  )
  const { data: tasks, status, error, refetch } = useTasks(queryInput)
  const toast = useToast()

  const createDialog = useOverlayTriggerState({})
  const editDialog = useOverlayTriggerState({})
  const deleteDialog = useOverlayTriggerState({})

  // Which task the edit and delete dialogs are about. Held here rather than on
  // the card, because a dialog rendered inside a card would be unmounted by the
  // refetch that follows a successful mutation — mid-transition.
  const [taskUnderAction, setTaskUnderAction] = useState<Task | null>(null)

  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  /** The API wants a DateTime; the date input gives `yyyy-MM-dd`. Midnight UTC
   *  is the instant `due-date.ts` reads back as that same calendar day. */
  function toApiDate(dueDate: string): string {
    return `${dueDate}T00:00:00.000Z`
  }

  async function handleCreate(fields: TaskFormFields) {
    await createTask.mutateAsync({
      name: fields.name.trim(),
      status: fields.status,
      tags: fields.tags,
      dueDate: toApiDate(fields.dueDate),
      pointEstimate: fields.pointEstimate,
      ...(fields.assigneeId ? { assigneeId: fields.assigneeId } : {}),
    })
    toast.show('success', 'Task created')
  }

  async function handleEdit(fields: TaskFormFields) {
    if (!taskUnderAction) {
      return
    }
    try {
      await updateTask.mutateAsync({
        id: taskUnderAction.id,
        name: fields.name.trim(),
        status: fields.status,
        tags: fields.tags,
        dueDate: toApiDate(fields.dueDate),
        pointEstimate: fields.pointEstimate,
        // Omitted when the field is blank, which is what leaves the server's own
        // ordering alone. Sending `null` would be a request to unset a `Float!`.
        ...(fields.position.trim() === '' ? {} : { position: Number(fields.position) }),
        // Sent even when empty, unlike the create path. `UpdateTaskInput` is a patch,
        // so omitting the field means "leave it as it is" — which made unassigning
        // impossible. `null` is what says "nobody".
        assigneeId: fields.assigneeId,
      })
      toast.show('success', 'Task updated')
    } catch (error) {
      // §4 asks for a notification whether the request succeeded *or failed*, and
      // the success half alone was the asymmetry: `handleDelete` below has always
      // reported both. The dialog's own `role="alert"` stays and is still the
      // primary report — it keeps the reason beside the form the user is looking
      // at — but it leaves with the dialog, and someone who dismisses a failed
      // save should not be left with no record that it failed.
      //
      // Rethrown, because `TaskFormDialog` catches this to render that alert and
      // keep itself open. Swallowing it here would close the dialog on failure and
      // throw the user's edits away.
      toast.show('error', error instanceof Error ? error.message : 'Could not save the task.')
      throw error
    }
  }

  async function handleDelete() {
    if (!taskUnderAction) {
      return
    }
    try {
      await deleteTask.mutateAsync(taskUnderAction.id)
      toast.show('success', 'Task deleted')
    } catch (error) {
      // The confirmation dialog has no room for an inline error, and the delete
      // is the kind of action a user needs told about either way.
      toast.show('error', error instanceof Error ? error.message : 'Could not delete the task.')
      throw error
    }
  }

  return (
    <main className="flex flex-col gap-6">
      <h1 className="sr-only">Dashboard</h1>

      <p role="status" className="sr-only">
        {boardStatusMessage(status, tasks?.length ?? 0)}
      </p>

      {isUsingMockApi ? (
        // Stated rather than hidden: a reviewer running this without a token
        // should know why the board has data, and should not mistake mock data
        // for a working connection to RAVN's API.
        <p className="text-muted text-body-m">
          Running on mocked data. Add <code className="text-main">VITE_API_TOKEN</code> to your{' '}
          <code className="text-main">.env</code> to use the live API.
        </p>
      ) : null}

      <BoardToolbar
        view={view}
        onViewChange={setView}
        onCreateTask={() => {
          createDialog.open()
        }}
      />

      <BoardFiltersBar
        filters={filters}
        setFilter={setFilter}
        clearAll={clearAll}
        isFiltered={isFiltered}
        users={users ?? []}
        directoryUnavailable={usersStatus === 'error'}
      />

      {/* Mounted only while open, so every visit starts from a blank form rather
          than whatever the last one was left holding — and so the edit dialog
          is seeded from the task it was opened for. */}
      {createDialog.isOpen ? (
        <TaskFormDialog
          state={createDialog}
          users={users ?? []}
          onSubmit={handleCreate}
          title="Create task"
          submitLabel="Create"
        />
      ) : null}

      {editDialog.isOpen && taskUnderAction ? (
        <TaskFormDialog
          state={editDialog}
          users={users ?? []}
          onSubmit={handleEdit}
          mode="edit"
          title={`Edit ${taskUnderAction.name}`}
          submitLabel="Save"
          initialFields={{
            name: taskUnderAction.name,
            status: taskUnderAction.status,
            tags: taskUnderAction.tags,
            dueDate: parseApiDate(taskUnderAction.dueDate)
              ? toDateInputValue(parseApiDate(taskUnderAction.dueDate) as Date)
              : '',
            pointEstimate: taskUnderAction.pointEstimate,
            position: String(taskUnderAction.position),
            assigneeId: taskUnderAction.assignee?.id ?? null,
          }}
        />
      ) : null}

      {deleteDialog.isOpen && taskUnderAction ? (
        <DeleteTaskDialog state={deleteDialog} task={taskUnderAction} onConfirm={handleDelete} />
      ) : null}

      {status === 'pending' ? <BoardSkeleton /> : null}

      {status === 'error' ? (
        <BoardError
          error={error}
          onRetry={() => {
            void refetch()
          }}
        />
      ) : null}

      {status === 'success' ? (
        tasks.length === 0 ? (
          // Two different empty states, because they mean different things and
          // need different ways out. "Nothing matched" with a "create your
          // first task" prompt would be actively misleading on a board that is
          // full of tasks the filters happen to exclude.
          isFiltered ? (
            <EmptyState
              title="No tasks match these filters"
              description="Try removing a filter, or search for something else."
              action={
                <Button variant="text" onPress={clearAll}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              title="No tasks yet"
              description="Create your first task with the + button above."
            />
          )
        ) : (
          <Board
            tasks={tasks}
            view={view}
            onEditTask={(task) => {
              setTaskUnderAction(task)
              editDialog.open()
            }}
            onDeleteTask={(task) => {
              setTaskUnderAction(task)
              deleteDialog.open()
            }}
          />
        )
      ) : null}
    </main>
  )
}
