import { useId, useMemo } from 'react'
import { Button } from '@/ui/button/button'
import { AssigneeIcon, CalendarIcon, PointsIcon } from '@ravn/ui-kit'
import { pointsLabel, statusLabel } from './task-display'
import { IconField } from './icon-field'
import { OptionalSelect, TagMultiSelect } from './option-select'
import type { SelectOption } from './select-option'
import type { BoardFilters } from './use-board-filters'
import {
  ALL_POINT_ESTIMATES,
  BOARD_STATUSES,
  type PointEstimate,
  type Status,
  type User,
} from './task-types'

interface BoardFiltersBarProps {
  filters: BoardFilters
  setFilter: <K extends keyof BoardFilters>(key: K, value: BoardFilters[K]) => void
  clearAll: () => void
  isFiltered: boolean
  users: User[]
  /**
   * The `Users` query failed, so `users` is not "nobody" but "unknown".
   *
   * Required rather than defaulted: the page knows the answer, and a default would
   * let a future caller render the picker in its silently-degraded state by
   * forgetting a prop — which is the defect this was added to fix.
   */
  directoryUnavailable: boolean
}

// Derived from module constants, so these are built once at import rather than on
// every render of the bar. The "any" entry is no longer here: `OptionalSelect`
// owns that sentinel and the round trip back out of it, so these lists hold only
// real choices and stay typed as their own enums.
const STATUS_ITEMS: SelectOption<Status>[] = BOARD_STATUSES.map((id) => ({
  id,
  label: statusLabel(id),
}))

const POINT_ITEMS: SelectOption<PointEstimate>[] = ALL_POINT_ESTIMATES.map((id) => ({
  id,
  label: pointsLabel(id),
}))

/**
 * The filter row above the board.
 *
 * Every control here maps to a field of `FilterTaskInput`, so narrowing happens
 * on the server. Filtering a full list client-side would mean fetching every
 * task in order to show three, and would quietly disagree with the API the
 * moment the dataset outgrew one response.
 *
 * "Clear" appears only when something is set — a permanently visible reset for
 * a board with no filters is a control that does nothing.
 */
export function BoardFiltersBar({
  filters,
  setFilter,
  clearAll,
  isFiltered,
  users,
  directoryUnavailable,
}: BoardFiltersBarProps) {
  const noticeId = useId()

  // The one picker whose options are not known at import. Memoised on `users` so
  // the array — and so each item object, which is the collection cache's key —
  // changes exactly when a name could have changed, and not on every render.
  const ownerItems = useMemo<SelectOption[]>(
    () => users.map((user) => ({ id: user.id, label: user.fullName })),
    [users],
  )

  return (
    <div className="flex flex-wrap items-center gap-4" role="group" aria-label="Filter tasks">
      <OptionalSelect
        label="Filter by status"
        placeholder="Status"
        options={STATUS_ITEMS}
        noneLabel="Any status"
        value={filters.status ?? null}
        onChange={(status) => {
          setFilter('status', status ?? undefined)
        }}
      />

      <TagMultiSelect
        label="Filter by tags"
        value={filters.tags}
        onChange={(tags) => {
          setFilter('tags', tags)
        }}
      />

      <OptionalSelect
        label="Filter by estimated points"
        placeholder="Estimate"
        icon={<PointsIcon className="size-6 shrink-0" />}
        options={POINT_ITEMS}
        noneLabel="Any estimate"
        value={filters.pointEstimate ?? null}
        onChange={(pointEstimate) => {
          setFilter('pointEstimate', pointEstimate ?? undefined)
        }}
      />

      {/* A failed directory says so on the control it broke, rather than leaving a
          picker that offers only "Any owner" and looks like a team of nobody. The
          message is the trigger's accessible description as well as visible text,
          which is the two places someone could be looking for it.

          Written out below rather than passed as the kit's `error` prop, which
          looks like the obvious fit and is not. Its association is built on React
          Aria's `useSlotId`, which resolves an id once against the DOM: an error
          absent at mount that appears later — exactly this one, since the directory
          can only fail after a request — never gets one, so the message renders
          with no id and the trigger with no `aria-describedby`. Confirmed in jsdom
          and in Chrome. An `aria-describedby` we own does not depend on that. */}
      <OptionalSelect
        label="Filter by owner"
        placeholder="Owner"
        icon={<AssigneeIcon className="size-6 shrink-0" />}
        aria-describedby={directoryUnavailable ? noticeId : undefined}
        options={ownerItems}
        noneLabel="Any owner"
        value={filters.ownerId ?? null}
        onChange={(ownerId) => {
          setFilter('ownerId', ownerId ?? undefined)
        }}
      />

      <IconField
        icon={<CalendarIcon className="text-muted size-6 shrink-0" />}
        label="Filter by due date"
        type="date"
        value={filters.dueDate ?? ''}
        onChange={(dueDate) => {
          setFilter('dueDate', dueDate === '' ? undefined : dueDate)
        }}
      />

      {isFiltered ? (
        <Button variant="text" onPress={clearAll}>
          Clear filters
        </Button>
      ) : null}

      {directoryUnavailable ? (
        // On its own line — `basis-full` in a wrapping row — so the chips keep
        // their places instead of the whole bar rearranging around a paragraph
        // that appeared mid-session.
        //
        // `text-danger-text` (danger-3), not `text-danger` (danger-5), which the
        // kit documents as a border colour: danger-5 measures 2.55:1 on the
        // darkest surface this can land on, against danger-3's 5.65:1.
        <p id={noticeId} className="text-danger-text text-body-m basis-full">
          Could not load the team directory, so filtering by owner is unavailable.
        </p>
      ) : null}
    </div>
  )
}
