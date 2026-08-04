import { useState } from 'react'
import { useOverlayTriggerState } from 'react-stately'
import { ApiError } from '@/graphql/client'
import { isUsingMockApi } from '@/lib/env'
import { EmptyState } from '@/ui/empty-state/empty-state'
import { Board } from './board'
import { BoardSkeleton } from './board-skeleton'
import { BoardToolbar, type BoardView } from './board-toolbar'
import { TaskFormDialog } from './task-form-dialog'
import type { TaskFormFields } from './task-form-state'
import { useCreateTask } from './use-create-task'
import { useTasks } from './use-tasks'
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
      <p className="text-text-secondary text-body-m max-w-md">{message}</p>
      {isAuth ? null : (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-card bg-brand text-body-m px-4 py-2 font-semibold"
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
  const { data: tasks, status, error, refetch } = useTasks()
  const { data: users } = useUsers()
  const createDialog = useOverlayTriggerState({})
  const createTask = useCreateTask()

  async function handleCreate(fields: TaskFormFields) {
    await createTask.mutateAsync({
      name: fields.name.trim(),
      status: fields.status,
      tags: fields.tags,
      // The input arrives as `yyyy-MM-dd`; the API wants a DateTime, and midnight
      // UTC is the instant `due-date.ts` reads back as that calendar day.
      dueDate: `${fields.dueDate}T00:00:00.000Z`,
      pointEstimate: fields.pointEstimate,
      ...(fields.assigneeId ? { assigneeId: fields.assigneeId } : {}),
    })
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
        <p className="text-text-secondary text-body-m">
          Running on mocked data. Add <code className="text-text-primary">VITE_API_TOKEN</code> to
          your <code className="text-text-primary">.env</code> to use the live API.
        </p>
      ) : null}

      <BoardToolbar
        view={view}
        onViewChange={setView}
        onCreateTask={() => {
          createDialog.open()
        }}
      />

      {/* Mounted only while open, so every visit starts from a blank form rather
          than whatever the last one was left holding. */}
      {createDialog.isOpen ? (
        <TaskFormDialog
          state={createDialog}
          users={users ?? []}
          onSubmit={handleCreate}
          title="Create task"
          submitLabel="Create"
        />
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
          <EmptyState
            title="No tasks yet"
            description="Create your first task with the + button above."
          />
        ) : (
          <Board tasks={tasks} view={view} />
        )
      ) : null}
    </main>
  )
}
