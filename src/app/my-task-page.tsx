import { Board } from '@/features/board/board'
import { BoardSkeleton } from '@/features/board/board-skeleton'
import { DeleteTaskDialog } from '@/features/board/delete-task-dialog'
import { TaskFormDialog } from '@/features/board/task-form-dialog'
import { toFormFields } from '@/features/board/task-mapping'
import { useBoardActions } from '@/features/board/use-board-actions'
import { useBoardDialogs } from '@/features/board/use-board-dialogs'
import { useTasks } from '@/features/board/use-tasks'
import { useUsers } from '@/features/board/use-users'
import { useProfile } from '@/features/profile/use-profile'
import type { Task, User } from '@/graphql/domain'
import { useCurrentDay } from '@/lib/use-current-day'
import { AsyncSection } from '@/ui/async-section/async-section'
import { EmptyState } from '@/ui/empty-state/empty-state'

// Same reasoning as `BoardPage`'s `NO_USERS`/`NO_TASKS`: a fresh `[]` on every render
// would defeat `TaskFormDialog`'s own memoisation of its assignee options.
const NO_USERS: User[] = []
const NO_TASKS: Task[] = []

/**
 * The signed-in user's own tasks — filtered by `assigneeId`, never `ownerId`.
 *
 * `FilterTaskInput` has both, and they are not interchangeable: `ownerId` matches
 * `Task.creator`, and every seeded task here has the same creator, so filtering by
 * it returns the entire board under whoever's account this is — not a personal
 * list at all. `assigneeId` matches `Task.assignee`, which is what "my task"
 * actually means. Verified live against the real API before this was written —
 * see app#155.
 *
 * Split out from `MyTaskPage` so the tasks query only ever runs once a signed-in
 * id exists to filter by; `MyTaskPage` itself guards on the profile's own load
 * state first. Passing `assigneeId: undefined` while the profile is still loading
 * would fetch the unfiltered list instead — briefly showing the whole board under
 * a "my task" heading, which is worse than showing nothing yet.
 */
function MyTaskList({ assigneeId }: { assigneeId: string }) {
  const today = useCurrentDay()
  const { data: users, status: usersStatus } = useUsers()
  const { data: tasks, status, error, refetch } = useTasks({ assigneeId })
  const loaded = tasks ?? NO_TASKS

  // The same dialog/action machinery `BoardPage` uses — this page never opens the
  // create dialog, so `openCreate` and `createState` are left unused rather than
  // rewiring a separate, smaller state machine for two-thirds of the same shape.
  const { dialog, editState, deleteState, openEdit, openDelete } = useBoardDialogs()
  const { edit, remove } = useBoardActions()

  return (
    <>
      {dialog.kind === 'edit' ? (
        <TaskFormDialog
          state={editState}
          users={users ?? NO_USERS}
          directoryUnavailable={usersStatus === 'error'}
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
        hasData={tasks !== undefined}
        loadingLabel="Loading your tasks"
        // Distinct from the `EmptyState` title below on purpose — `BoardPage` establishes
        // the same split (`readyLabel="No tasks to show"` against its own two different
        // titles), because the live region and the empty state's own text both landing on
        // the same string leaves two elements with identical text, one of them `sr-only`.
        readyLabel={
          loaded.length === 0 ? 'No tasks to show' : `${String(loaded.length)} tasks loaded`
        }
        errorTitle="Could not load your tasks"
        errorFallback="Could not load your tasks. Please try again."
        skeleton={<BoardSkeleton />}
        onRetry={() => {
          void refetch()
        }}
        errorClassName="items-center py-16 text-center"
      >
        {loaded.length === 0 ? (
          <EmptyState
            title="No tasks assigned to you"
            description="Tasks someone assigns to you will show up here."
          />
        ) : (
          // Always the list layout — this page has no grid/list switcher, since
          // it is one person's own tasks rather than the whole board.
          <Board
            tasks={loaded}
            view="list"
            now={today}
            onEditTask={openEdit}
            onDeleteTask={openDelete}
          />
        )}
      </AsyncSection>
    </>
  )
}

/**
 * The sidebar's "My task" destination — the signed-in user's own tasks, not the
 * profile page `/settings` used to be reached through under the same label. See
 * app#155 for why the split happened: "my task" read as the profile screen only
 * because the brief's §6 wording was taken literally, and it does not match what
 * the phrase means in a task-management app.
 *
 * Lives in `src/app/` rather than inside `features/board` or `features/profile`,
 * because it genuinely needs both and the lint rule against cross-feature imports
 * has no exception for either — `src/app/` is the one layer allowed to compose
 * features without restriction, which is exactly this page's job.
 */
export function MyTaskPage() {
  const { data: profile, status, error, refetch } = useProfile()

  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-body-xl font-semibold">My task</h1>

      <AsyncSection
        status={status}
        error={error}
        hasData={profile !== undefined}
        loadingLabel="Loading your profile"
        readyLabel="Profile loaded"
        errorTitle="Could not load your tasks"
        errorFallback="Please try again."
        skeleton={<BoardSkeleton />}
        onRetry={() => {
          void refetch()
        }}
        errorClassName="items-center py-16 text-center"
      >
        {/* Guarded rather than asserted, same reason as `ProfilePage`: `AsyncSection`
            renders children only on success, but JSX evaluates them eagerly, so this
            branch is genuinely taken on every pending and error render too. */}
        {profile ? <MyTaskList assigneeId={profile.id} /> : null}
      </AsyncSection>
    </main>
  )
}
