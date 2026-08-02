import { useState } from 'react'
import { SEED_TASKS } from '@/mocks/task-fixtures'
import { Board } from './board'
import { BoardToolbar, type BoardView } from './board-toolbar'

/**
 * The dashboard.
 *
 * The brief asks for this phase to be UI only, so the board renders seed data
 * and the create button is inert. The next phase replaces `SEED_TASKS` with the
 * `tasks` query; nothing else in this tree changes, because every component
 * below already takes its data as props.
 */
export function BoardPage() {
  const [view, setView] = useState<BoardView>('grid')

  return (
    <main className="flex flex-col gap-6">
      <h1 className="sr-only">Dashboard</h1>
      <BoardToolbar
        view={view}
        onViewChange={setView}
        onCreateTask={() => {
          // Wired up in the phase that adds the create mutation.
        }}
      />
      <Board tasks={SEED_TASKS} view={view} />
    </main>
  )
}
