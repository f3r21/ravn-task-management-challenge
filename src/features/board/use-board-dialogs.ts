import { useCallback, useState } from 'react'
import { useOverlayTriggerState, type OverlayTriggerState } from 'react-stately'
import type { Task } from './task-types'

/**
 * Which dialog the board has open, and what it is about.
 *
 * A discriminated union rather than three booleans and a nullable `Task`. That
 * spelling had 2³ × 2 = 16 representable states for a machine with four legal
 * ones, and the illegal ones were not theoretical: `createDialog.isOpen &&
 * editDialog.isOpen` rendered two `TaskFormDialog`s at once, and the task
 * outlived every close, so the edit dialog's title could be computed from a task
 * that had already been deleted.
 *
 * The argument is the project's own, made one file over: `task-form-dialog.tsx`
 * explains at length that a submit lifecycle must be a union because
 * `isSubmitting` plus `errorMessage` "can express 'submitting while showing an
 * error', which is not a state this form has". Same reasoning, now applied here.
 *
 * Carrying the `Task` *on* the variant is what does the work. It cannot be stale,
 * because it does not exist between dialogs — and the two `if (!taskUnderAction)
 * return` guards it replaces were unreachable defensive code that TypeScript
 * could not see through, and were the only uncovered branches in `board-page.tsx`.
 */
export type BoardDialog =
  | { kind: 'none' }
  | { kind: 'create' }
  | { kind: 'edit'; task: Task }
  | { kind: 'delete'; task: Task }

export interface BoardDialogs {
  dialog: BoardDialog
  /** React Aria's own state for each dialog, derived from `dialog` above. */
  createState: OverlayTriggerState
  editState: OverlayTriggerState
  deleteState: OverlayTriggerState
  openCreate: () => void
  openEdit: (task: Task) => void
  openDelete: (task: Task) => void
}

/**
 * The board's dialog state machine.
 *
 * One `useState` is the source of truth; the three `OverlayTriggerState`s are
 * *derived views* of it, driven in React Aria's controlled mode. They exist
 * because `Modal` and `Dialog` take that shape — not because the board has three
 * independent pieces of state. Only one can report `isOpen` at a time, by
 * construction, so the illegal combinations are no longer expressible.
 *
 * The three openers are `useCallback`s with empty dependency arrays, and that is
 * load-bearing rather than habitual: `openEdit` and `openDelete` reach every
 * `TaskCard` as `onEdit`/`onDelete`, where `memo()` compares them by identity, and
 * this page re-renders on every keystroke in the header's search box.
 * `board-render-cost.test.tsx` is what notices if they stop being stable.
 *
 * This also retires a workaround. Those two callbacks previously closed over
 * `useOverlayTriggerState`'s object, which is rebuilt on every render, so they had
 * to read it through refs synced in an effect to stay stable. A state setter is
 * stable by definition, so the refs and the effect are gone — the union removed
 * the reason they existed.
 */
export function useBoardDialogs(): BoardDialogs {
  const [dialog, setDialog] = useState<BoardDialog>({ kind: 'none' })

  // One handler for all three, because every close lands in the same place. React
  // Aria calls this with `false` when the user dismisses — Escape, the backdrop,
  // the close button — and the dialogs call `state.close()` themselves after a
  // successful submit.
  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setDialog({ kind: 'none' })
    }
  }, [])

  const createState = useOverlayTriggerState({
    isOpen: dialog.kind === 'create',
    onOpenChange: handleOpenChange,
  })
  const editState = useOverlayTriggerState({
    isOpen: dialog.kind === 'edit',
    onOpenChange: handleOpenChange,
  })
  const deleteState = useOverlayTriggerState({
    isOpen: dialog.kind === 'delete',
    onOpenChange: handleOpenChange,
  })

  const openCreate = useCallback(() => {
    setDialog({ kind: 'create' })
  }, [])

  const openEdit = useCallback((task: Task) => {
    setDialog({ kind: 'edit', task })
  }, [])

  const openDelete = useCallback((task: Task) => {
    setDialog({ kind: 'delete', task })
  }, [])

  return { dialog, createState, editState, deleteState, openCreate, openEdit, openDelete }
}
