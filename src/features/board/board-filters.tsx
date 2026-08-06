import { useId } from 'react'
import { Item } from 'react-stately'
import { MultiSelect, Select } from '@ravn/ui-kit'
import { Button } from '@/ui/button/button'
import { AssigneeIcon, CalendarIcon, LabelIcon, PointsIcon } from '@/ui/icons/icons'
import { pointsLabel, statusLabel, tagLabel } from './task-display'
import type { BoardFilters } from './use-board-filters'
import {
  ALL_POINT_ESTIMATES,
  ALL_TAGS,
  BOARD_STATUSES,
  type PointEstimate,
  type Status,
  type TaskTag,
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

/**
 * The key standing in for "no filter" in each single-select.
 *
 * An explicit option rather than a way of clearing the control: a single-select has
 * no gesture for "undo my pick", so without one the only escape from a filter was
 * "Clear filters", which drops all six at once. §5 is about *combining* filters, so
 * backing one of them out individually has to be possible.
 *
 * Prefixed so it cannot collide with a status, an estimate or a user id.
 */
const ANY = '__any__'

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

  return (
    <div className="flex flex-wrap items-center gap-4" role="group" aria-label="Filter tasks">
      <Select<{ id: string }>
        label="Filter by status"
        placeholder="Status"
        items={[{ id: ANY }, ...BOARD_STATUSES.map((id) => ({ id }))]}
        selectedKey={filters.status ?? ANY}
        onSelectionChange={(key) => {
          const id = String(key)
          setFilter('status', id === ANY ? undefined : (id as Status))
        }}
      >
        {(item) => (
          <Item key={item.id}>
            {item.id === ANY ? 'Any status' : statusLabel(item.id as Status)}
          </Item>
        )}
      </Select>

      <MultiSelect<{ id: TaskTag }>
        label="Filter by tags"
        placeholder="Tags"
        icon={<LabelIcon className="size-6 shrink-0" />}
        items={ALL_TAGS.map((id) => ({ id }))}
        selectedKeys={filters.tags}
        onSelectionChange={(keys) => {
          const next: TaskTag[] =
            keys === 'all' ? [...ALL_TAGS] : ([...keys].map(String) as TaskTag[])
          setFilter('tags', next)
        }}
      >
        {(item) => <Item key={item.id}>{tagLabel(item.id)}</Item>}
      </MultiSelect>

      <Select<{ id: string }>
        label="Filter by estimated points"
        placeholder="Estimate"
        icon={<PointsIcon className="size-6 shrink-0" />}
        items={[{ id: ANY }, ...ALL_POINT_ESTIMATES.map((id) => ({ id }))]}
        selectedKey={filters.pointEstimate ?? ANY}
        onSelectionChange={(key) => {
          const id = String(key)
          setFilter('pointEstimate', id === ANY ? undefined : (id as PointEstimate))
        }}
      >
        {(item) => (
          <Item key={item.id}>
            {item.id === ANY ? 'Any estimate' : pointsLabel(item.id as PointEstimate)}
          </Item>
        )}
      </Select>

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
      <Select<{ id: string }>
        label="Filter by owner"
        placeholder="Owner"
        icon={<AssigneeIcon className="size-6 shrink-0" />}
        aria-describedby={directoryUnavailable ? noticeId : undefined}
        items={[{ id: ANY }, ...users.map((user) => ({ id: user.id }))]}
        selectedKey={filters.ownerId ?? ANY}
        onSelectionChange={(key) => {
          const id = String(key)
          setFilter('ownerId', id === ANY ? undefined : id)
        }}
      >
        {(item) => (
          <Item key={item.id}>
            {item.id === ANY
              ? 'Any owner'
              : (users.find((user) => user.id === item.id)?.fullName ?? item.id)}
          </Item>
        )}
      </Select>

      <div className="rounded-4 bg-muted/10 flex items-center gap-2 px-4 py-1">
        <CalendarIcon className="text-muted size-6 shrink-0" />
        <label htmlFor="filter-due-date" className="sr-only">
          Filter by due date
        </label>
        <input
          id="filter-due-date"
          type="date"
          value={filters.dueDate ?? ''}
          onChange={(event) => {
            setFilter('dueDate', event.target.value === '' ? undefined : event.target.value)
          }}
          className="text-body-m bg-transparent font-semibold outline-none"
        />
      </div>

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
