import { useMemo, useState } from 'react'
import { TextButton } from '@ravn/ui-kit'
import { isUsingMockApi } from '@/lib/env'
import { AsyncSection } from '@/ui/async-section/async-section'
import { EmptyState } from '@/ui/empty-state/empty-state'
import { Board } from './board'
import { BoardSkeleton } from './board-skeleton'
import { BoardFiltersBar } from './board-filters'
import { BoardToolbar, type BoardView } from './board-toolbar'
import { DeleteTaskDialog } from './delete-task-dialog'
import { TaskFormDialog } from './task-form-dialog'
import { toFormFields } from './task-mapping'
import type { Task, User } from './task-types'
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
 * The board before it has loaded, for the same reason as `NO_USERS`.
 *
 * `AsyncSection` renders its children only on success, but JSX evaluates them
 * eagerly, so the tree below has to be writable while `tasks` is still undefined.
 * A module constant keeps that from being a fresh array on every render.
 */
const NO_TASKS: Task[] = []

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
  const loaded = tasks ?? NO_TASKS

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

      <AsyncSection
        status={status}
        error={error}
        loadingLabel="Loading tasks"
        readyLabel={
          loaded.length === 0 ? 'No tasks to show' : `${String(loaded.length)} tasks loaded`
        }
        errorTitle="Could not load the board"
        // A rejected token and an unreachable server need different words: one is
        // something the reader can fix in `.env`, the other is worth retrying.
        // `AsyncSection` uses the `ApiError` message when there is one, so this
        // only covers a failure that carries nothing a user could act on.
        errorFallback="Could not load tasks. Please try again."
        skeleton={<BoardSkeleton />}
        onRetry={() => {
          void refetch()
        }}
        errorClassName="items-center py-16 text-center"
      >
        {loaded.length === 0 ? (
          // Two different empty states, because they mean different things and
          // need different ways out. "Nothing matched" with a "create your
          // first task" prompt would be actively misleading on a board that is
          // full of tasks the filters happen to exclude.
          isFiltered ? (
            <EmptyState
              title="No tasks match these filters"
              description="Try removing a filter, or search for something else."
              action={
                <TextButton variant="secondary" onPress={clearAll}>
                  Clear filters
                </TextButton>
              }
            />
          ) : (
            <EmptyState
              title="No tasks yet"
              description="Create your first task with the + button above."
            />
          )
        ) : (
          <Board tasks={loaded} view={view} onEditTask={openEdit} onDeleteTask={openDelete} />
        )}
      </AsyncSection>
    </main>
  )
}
