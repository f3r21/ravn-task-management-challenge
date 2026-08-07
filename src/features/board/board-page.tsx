import { useMemo, useState } from 'react'
import { ApiError } from '@/graphql/client'
import { isUsingMockApi } from '@/lib/env'
import { Button } from '@/ui/button/button'
import { EmptyState } from '@/ui/empty-state/empty-state'
import { Board } from './board'
import { BoardSkeleton } from './board-skeleton'
import { BoardFiltersBar } from './board-filters'
import { BoardToolbar, type BoardView } from './board-toolbar'
import { DeleteTaskDialog } from './delete-task-dialog'
import { TaskFormDialog } from './task-form-dialog'
import { toFormFields } from './task-mapping'
import type { User } from './task-types'
import { useBoardActions } from './use-board-actions'
import { useBoardDialogs } from './use-board-dialogs'
import { useBoardFilters } from './use-board-filters'
import { useTasks } from './use-tasks'
import { useUsers } from './use-users'

/**
 * The directory when there isn't one: empty, and the *same* empty every time.
 *
 * `useUsers()` reports `undefined` while it is loading and after it has failed, so
 * the obvious `users ?? []` at each call site below mints a fresh array on every
 * render — and both `BoardFiltersBar` and `TaskFormDialog` memoise their option
 * lists on exactly that value, so those memos could never hit. The failed case is
 * not a transient either: it is the permanent `directoryUnavailable` state the
 * filter bar renders a notice for, so the memoisation would have been dead in the
 * one state it most needed to work. Same reasoning as `NO_KNOWN_OWNERS` in
 * `use-board-filters.ts`.
 */
const NO_USERS: User[] = []

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
  const ownerIds = useMemo(() => (users ?? NO_USERS).map((user) => user.id), [users])
  const { filters, queryInput, setFilter, clearAll, isFiltered } = useBoardFilters(
    ownerIds,
    usersStatus === 'pending' ? 'pending' : 'ready',
  )
  const { data: tasks, status, error, refetch } = useTasks(queryInput)

  // One state machine for all three dialogs, rather than three booleans and a
  // nullable task. `openEdit`/`openDelete` are stable across renders, which
  // `memo(TaskCard)` depends on — see `use-board-dialogs.ts`.
  const { dialog, createState, editState, deleteState, openCreate, openEdit, openDelete } =
    useBoardDialogs()

  // What the board can do, and what the user is told about each. The three take
  // the task they act on as an argument rather than reading it from state, so
  // there is no "which task is this about?" to get wrong and no unreachable
  // `if (!task) return` guard — each call site below sits inside a branch that
  // has already narrowed `dialog` to the variant carrying it.
  const { create, edit, remove } = useBoardActions()

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

      <BoardToolbar view={view} onViewChange={setView} onCreateTask={openCreate} />

      <BoardFiltersBar
        filters={filters}
        setFilter={setFilter}
        clearAll={clearAll}
        isFiltered={isFiltered}
        users={users ?? NO_USERS}
        directoryUnavailable={usersStatus === 'error'}
      />

      {/* Mounted only while open, so every visit starts from a blank form rather
          than whatever the last one was left holding — and so the edit dialog is
          seeded from the task it was opened for.

          Switching on `dialog.kind` rather than testing three `isOpen` flags is
          what makes "two dialogs at once" unrepresentable, and it narrows the
          union so each branch's `dialog.task` is typed without a guard. */}
      {dialog.kind === 'create' ? (
        <TaskFormDialog
          state={createState}
          users={users ?? NO_USERS}
          onSubmit={create}
          title="Create task"
          submitLabel="Create"
        />
      ) : null}

      {dialog.kind === 'edit' ? (
        <TaskFormDialog
          state={editState}
          users={users ?? NO_USERS}
          onSubmit={(fields) => edit(dialog.task, fields)}
          mode="edit"
          title={`Edit ${dialog.task.name}`}
          submitLabel="Save"
          initialFields={toFormFields(dialog.task)}
        />
      ) : null}

      {dialog.kind === 'delete' ? (
        <DeleteTaskDialog
          state={deleteState}
          task={dialog.task}
          onConfirm={() => remove(dialog.task)}
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
          <Board tasks={tasks} view={view} onEditTask={openEdit} onDeleteTask={openDelete} />
        )
      ) : null}
    </main>
  )
}
