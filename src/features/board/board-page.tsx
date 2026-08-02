import { useState } from 'react'
import { ApiError } from '@/graphql/client'
import { isUsingMockApi } from '@/lib/env'
import { EmptyState } from '@/ui/empty-state/empty-state'
import { Board } from './board'
import { BoardSkeleton } from './board-skeleton'
import { BoardToolbar, type BoardView } from './board-toolbar'
import { useTasks } from './use-tasks'

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

export function BoardPage() {
  const [view, setView] = useState<BoardView>('grid')
  const { data: tasks, status, error, refetch } = useTasks()

  return (
    <main className="flex flex-col gap-6">
      <h1 className="sr-only">Dashboard</h1>

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
          // Wired up in the phase that adds the create mutation.
        }}
      />

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
