import { useId, useMemo, useReducer, useRef, useState } from 'react'
import { type OverlayTriggerState } from 'react-stately'
import { Modal, MultiSelect, Select } from '@ravn/ui-kit'
import { toDateInputValue } from '@/lib/due-date'
import { Button } from '@/ui/button/button'
import { AssigneeIcon, CalendarIcon, LabelIcon, PointsIcon } from '@/ui/icons/icons'
import { renderSelectOption, type SelectOption } from './select-option'
import { pointsLabel, statusLabel, tagLabel } from './task-display'
import { taskFormReducer, validateTaskForm, type TaskFormFields } from './task-form-state'
import {
  ALL_POINT_ESTIMATES,
  ALL_TAGS,
  BOARD_STATUSES,
  type PointEstimate,
  type Status,
  type TaskTag,
  type User,
} from './task-types'

interface TaskFormDialogProps {
  state: OverlayTriggerState
  users: User[]
  /** Rejects with the API's message so the dialog can show it inline. */
  onSubmit: (fields: TaskFormFields) => Promise<void>
  /** Title and confirm wording, so the edit flow can reuse this dialog. */
  title: string
  submitLabel: string
  initialFields?: Partial<TaskFormFields>
  /**
   * `edit` adds the position field. `CreateTaskInput` has no `position` — the
   * server assigns it — so offering the control on create would collect a value
   * with nowhere to send it.
   */
  mode?: 'create' | 'edit'
}

/**
 * The key standing in for "nobody" in the assignee picker.
 *
 * A sentinel rather than `null`, because a react-stately collection is keyed by
 * string. Prefixed so it cannot collide with a real user id.
 */
const UNASSIGNED = '__unassigned__'

// Built once at import rather than on every render of the form. This dialog
// re-renders on every keystroke in the task title, and each of these arrays
// reaching a picker with a new identity rebuilds that picker's whole
// react-stately collection. See `renderSelectOption` for why the label is baked
// into the item instead of computed by the render function.
const POINT_ITEMS: SelectOption[] = ALL_POINT_ESTIMATES.map((id) => ({
  id,
  label: pointsLabel(id),
}))

const TAG_ITEMS: SelectOption[] = ALL_TAGS.map((id) => ({ id, label: tagLabel(id) }))

const STATUS_ITEMS: SelectOption[] = BOARD_STATUSES.map((id) => ({ id, label: statusLabel(id) }))

function initialState(overrides: Partial<TaskFormFields> = {}): TaskFormFields {
  return {
    name: '',
    status: 'BACKLOG',
    tags: [],
    dueDate: toDateInputValue(new Date()),
    pointEstimate: 'ZERO',
    assigneeId: null,
    position: '',
    ...overrides,
  }
}

/**
 * The create/edit task dialog.
 *
 * The submit lifecycle is a discriminated union rather than a pair of booleans:
 * `idle | submitting | error`. An `isSubmitting` plus `errorMessage` can express
 * "submitting while showing an error", which is not a state this form has, and
 * the bug it produces — a stale error left visible under a spinner — is exactly
 * the kind that survives review.
 */
type SubmitState =
  { status: 'idle' } | { status: 'submitting' } | { status: 'error'; message: string }

export function TaskFormDialog({
  state,
  users,
  onSubmit,
  title,
  submitLabel,
  initialFields,
  mode = 'create',
}: TaskFormDialogProps) {
  const [fields, dispatch] = useReducer(taskFormReducer, initialFields, initialState)
  const [submitState, setSubmitState] = useState<SubmitState>({ status: 'idle' })
  const nameId = useId()
  const dueDateId = useId()
  const positionId = useId()
  const errorId = useId()
  const nameRef = useRef<HTMLInputElement>(null)

  // The one picker whose options are not known at import. Memoised on `users` so
  // each item object — which is the collection cache's key — changes exactly when
  // a name could have changed, and not on every keystroke in the title field.
  const assigneeItems = useMemo<SelectOption[]>(
    () => [
      { id: UNASSIGNED, label: 'Unassigned' },
      ...users.map((user) => ({ id: user.id, label: user.fullName })),
    ],
    [users],
  )

  const validationError = validateTaskForm(fields)
  const shownError = submitState.status === 'error' ? submitState.message : undefined

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    // Validation runs on submit, not on every keystroke: telling someone the
    // name is required while they are still typing it is noise.
    if (validationError) {
      setSubmitState({ status: 'error', message: validationError })
      nameRef.current?.focus()
      return
    }

    setSubmitState({ status: 'submitting' })
    try {
      await onSubmit(fields)
      state.close()
    } catch (error) {
      setSubmitState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Could not save the task.',
      })
    }
  }

  const isSubmitting = submitState.status === 'submitting'

  return (
    <Modal
      title={title}
      isOpen={state.isOpen}
      onClose={() => {
        if (!isSubmitting) {
          state.close()
        }
      }}
      width="max-w-[578px]"
    >
      <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-6">
        <div>
          <label htmlFor={nameId} className="sr-only">
            Task title
          </label>
          <input
            id={nameId}
            ref={nameRef}
            value={fields.name}
            onChange={(event) => {
              dispatch({ type: 'set-name', name: event.target.value })
            }}
            placeholder="Task title"
            autoFocus
            aria-describedby={shownError ? errorId : undefined}
            aria-invalid={shownError ? true : undefined}
            className="text-body-xl placeholder:text-muted w-full bg-transparent font-semibold outline-none"
          />
        </div>

        <div className="flex flex-wrap items-start gap-4">
          <Select<SelectOption>
            label="Estimated points"
            placeholder="Estimate"
            icon={<PointsIcon className="size-6 shrink-0" />}
            items={POINT_ITEMS}
            selectedKey={fields.pointEstimate}
            onSelectionChange={(key) => {
              dispatch({ type: 'set-point-estimate', pointEstimate: String(key) as PointEstimate })
            }}
          >
            {renderSelectOption}
          </Select>

          {/* "Unassigned" is an option rather than a way of clearing the control,
              because taking the owner off a task is a choice a user makes, not the
              absence of one — and a single-select has no gesture for "undo my
              pick". `assigneeId` is nullable on the API, so this maps onto a real
              value the mutation can carry. */}
          <Select<SelectOption>
            label="Assignee"
            placeholder="Assignee"
            icon={<AssigneeIcon className="size-6 shrink-0" />}
            items={assigneeItems}
            selectedKey={fields.assigneeId ?? UNASSIGNED}
            onSelectionChange={(key) => {
              const id = String(key)
              dispatch({ type: 'set-assignee', assigneeId: id === UNASSIGNED ? null : id })
            }}
          >
            {renderSelectOption}
          </Select>

          <MultiSelect<SelectOption>
            label="Tags"
            placeholder="Label"
            icon={<LabelIcon className="size-6 shrink-0" />}
            items={TAG_ITEMS}
            selectedKeys={fields.tags}
            onSelectionChange={(keys) => {
              const tags: TaskTag[] =
                keys === 'all' ? [...ALL_TAGS] : ([...keys].map(String) as TaskTag[])
              dispatch({ type: 'set-tags', tags })
            }}
          >
            {renderSelectOption}
          </MultiSelect>

          <Select<SelectOption>
            label="Status"
            placeholder="Status"
            items={STATUS_ITEMS}
            selectedKey={fields.status}
            onSelectionChange={(key) => {
              dispatch({ type: 'set-status', status: String(key) as Status })
            }}
          >
            {renderSelectOption}
          </Select>

          <div className="rounded-4 bg-muted/10 flex items-center gap-2 px-4 py-1">
            <CalendarIcon className="text-muted size-6 shrink-0" />
            <label htmlFor={dueDateId} className="sr-only">
              Due date
            </label>
            {/* A native date input rather than a custom calendar: it brings the
                platform's own picker, works on touch, and is already localised
                and keyboard-accessible. */}
            <input
              id={dueDateId}
              type="date"
              value={fields.dueDate}
              onChange={(event) => {
                dispatch({ type: 'set-due-date', dueDate: event.target.value })
              }}
              className="text-body-m bg-transparent font-semibold outline-none"
            />
          </div>

          {mode === 'edit' ? (
            <div className="rounded-4 bg-muted/10 flex items-center gap-2 px-4 py-1">
              <PointsIcon className="text-muted size-6 shrink-0" />
              <label htmlFor={positionId} className="sr-only">
                Position
              </label>
              {/* A native number input, for the same reasons the due date is a
                  native date input: the platform supplies the stepper, the mobile
                  keypad and the keyboard handling. `step="any"` because the field
                  is a Float — the board leaves gaps between positions so a task can
                  be placed between two others without renumbering the column. */}
              <input
                id={positionId}
                type="number"
                step="any"
                value={fields.position}
                onChange={(event) => {
                  dispatch({ type: 'set-position', position: event.target.value })
                }}
                className="text-body-m w-20 bg-transparent font-semibold outline-none"
              />
            </div>
          ) : null}
        </div>

        {shownError ? (
          // `text-danger-text` (danger-3), not `text-danger` (danger-5), which the
          // kit documents as a *border* colour. This paragraph sits on the modal's
          // `surface-overlay`, the darkest surface a form here can land on, where
          // danger-5 measures 2.55:1 against danger-3's 5.65:1. It is also the only
          // report of a failed save, so it is the last place to be relying on a
          // colour a reader has to squint at.
          <p id={errorId} role="alert" className="text-danger-text text-body-m">
            {shownError}
          </p>
        ) : null}

        <div className="flex justify-end gap-6">
          <Button
            variant="text"
            onPress={() => {
              state.close()
            }}
            isDisabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" isDisabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
